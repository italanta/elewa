import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { Observable, forkJoin, of, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentMode, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentQuestionService, AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, OnDestroy {
  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  pageTitle: string;
 
  assessmentMode: AssessmentMode;
  assessmentForm: FormGroup;

  assessment: Assessment;

  private _sbS = new SubSink();
  isPublishing = false;
  
  constructor(private _assessment: AssessmentService,
              private _assessmentForm: AssessmentFormService,
              private _assessmentQuestion: AssessmentQuestionService,
              private _router: Router,
              private _route: ActivatedRoute){}

  ngOnInit(): void {
    this.initAssessment();
    this.setPageTitle();
    this.createFormGroup();
  }

  initAssessment(){
    const assessmentId = this._route.snapshot.paramMap.get('id') as string;
    this.assessment$ = this._assessment.getAssessment$(assessmentId) as Observable<Assessment>; 
    this.questions$ = this._assessmentQuestion.getQuestions$();
    this.assessmentMode = this.getAssessmentMode();
  }

  setPageTitle(){
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) => {
        this.assessment = _assessment;
        this.pageTitle = `Assessments/${this.assessment.title}/${AssessmentMode[this.assessmentMode]}`; 
      })
    ).subscribe();
  }

  createFormGroup(){
    this.assessmentForm = this._assessmentForm.createAssessmentDetailForm();
  }

  getAssessmentMode(){
    const assessmentMode = this._route.snapshot.queryParamMap.get('mode') as string;

    // 1 = "Edit" & 0 = "View"
    if(assessmentMode === 'edit'){
      return AssessmentMode.Edit;
    } else {
      return AssessmentMode.View;
    }
  }

  onPublish(){
    this.isPublishing = true;

    this._sbS.add(
      forkJoin([this.insertAssessmentConfig$(), this.insertAssessmentQuestions$()]).subscribe(_saved => {
        if(_saved){
          console.log(_saved);
          console.log('Saved');
        }
      })
    );
  }

  toggleForm(){
    this.assessmentMode = AssessmentMode.Edit;
    // Update url parameter mode to edit
    this._router.navigate(['/assessments', this.assessment.id, {mode: 'edit'}]);
    this.pageTitle = `Assessments/${this.assessment.title}/${AssessmentMode[this.assessmentMode]}`;
  }

  determineAction(){
    this.assessmentMode ? this.onPublish() : this.toggleForm();
  }

  insertAssessmentConfig$(){
    this.assessment.configs = {
      feedback: this.assessmentForm.value.configs.feedback,
      userAttempts: this.assessmentForm.value.configs.userAttempts
    }

    return this._assessment.updateAssessment$(this.assessment);
  }

  insertAssessmentQuestions$(){
    const assessmentQuestions: AssessmentQuestion[] = this.assessmentForm.value.questions;
    return this._assessmentQuestion.addQuestions$(assessmentQuestions);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
