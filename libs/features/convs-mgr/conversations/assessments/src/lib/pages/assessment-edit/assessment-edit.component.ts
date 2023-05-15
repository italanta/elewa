import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, of, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentQuestion, AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentConfigComponent } from '../../components/assessment-config/assessment-config.component';
import { AssessmentQuestionsComponent } from '../../components/assessment-questions/assessment-questions.component';


@Component({
  selector: 'italanta-apps-assessment-edit',
  templateUrl: './assessment-edit.component.html',
  styleUrls: ['./assessment-edit.component.scss'],
})
export class AssessmentEditComponent implements OnInit, OnDestroy {
  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  pageTitle: string;
  assessmentTitle: string;
  assessmentDesc: string;

  assessmentMode: number

  @ViewChild(AssessmentConfigComponent) configComponent: AssessmentConfigComponent;
  @ViewChild(AssessmentQuestionsComponent) questionsComponent: AssessmentQuestionsComponent;

  private _sbS = new SubSink();
  
  constructor(private _assessment: AssessmentService,
              private _route: ActivatedRoute){}

  ngOnInit(): void {
    this.initAssessment();
    this.setPageTitle();
  }

  initAssessment(){
    let assessmentId = this._route.snapshot.paramMap.get('id') as string;
    this.assessment$ = this._assessment.getAssessment$(assessmentId) as Observable<Assessment>; 
    this.questions$ = of([]);

    // Get assessment mode; 1 - Assessment Create  0 - Assessment Edit
    this.assessmentMode = Number(this._route.snapshot.queryParamMap.get('mode'));
  }

  setPageTitle(){
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) => {
        this.assessmentTitle = _assessment.title;
        this.assessmentDesc = _assessment.description;
        this.pageTitle = `Assessments/${this.assessmentTitle}/Edit`;
      })
    ).subscribe();
  }

  onPublish(){
    // Add publish functionality
  }

  get assessmentInfo(){
    let assessment: Assessment = {
      title: this.assessmentTitle,
      description: this.assessmentDesc,
      configs: {
        feedback: this.configComponent.config.value.feedback,
        userAttempts: this.configComponent.config.value.userAttempts
      }
    }

    return assessment;
  }

  get questionsInfo(){
    return this.questionsComponent.inputQuestions;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
