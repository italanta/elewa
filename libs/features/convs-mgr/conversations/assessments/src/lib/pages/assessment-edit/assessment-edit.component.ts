import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { Observable, forkJoin, of, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentQuestionService, AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-edit',
  templateUrl: './assessment-edit.component.html',
  styleUrls: ['./assessment-edit.component.scss'],
})
export class AssessmentEditComponent implements OnInit, OnDestroy {
  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  pageTitle: string;
 
  assessmentMode: number;
  assessmentForm: FormGroup;

  assessment: Assessment;

  private _sbS = new SubSink();
  
  constructor(private _assessment: AssessmentService,
              private _assessmentForm: AssessmentFormService,
              private _assessmentQuestion: AssessmentQuestionService,
              private _route: ActivatedRoute){}

  ngOnInit(): void {
    this.initAssessment();
    this.setPageTitle();
    this.createFormGroup();
  }

  initAssessment(){
    const assessmentId = this._route.snapshot.paramMap.get('id') as string;
    this.assessment$ = this._assessment.getAssessment$(assessmentId) as Observable<Assessment>; 
    this.questions$ = of([]);

    // Get assessment mode; 1 - Assessment Create  0 - Assessment Edit
    this.assessmentMode = Number(this._route.snapshot.queryParamMap.get('mode'));
  }

  setPageTitle(){
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) => {
        this.assessment = _assessment;
        this.pageTitle = `Assessments/${this.assessment.title}/Edit`;
      })
    ).subscribe();
  }

  createFormGroup(){
    this.assessmentForm = this._assessmentForm.createAssessmentDetailForm();
  }

  onPublish(){
    this._sbS.add(
      forkJoin([this.insertAssessmentConfig$(), this.insertAssessmentQuestions$()]).subscribe(_saved => {
        if(_saved){
          console.log(_saved);
          console.log('Saved');
        }
      })
    );
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
