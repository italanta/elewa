import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppStatus, MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentProgressUpdate, QuestionResponse } from '@app/model/convs-mgr/micro-app/assessments';
import { MicroAppManagementService, MicroAppStore } from '@app/state/convs-mgr/micro-app';

import { __CalculateProgress } from '../../utils/calculate-progress.util';
import { PageViewMode } from '../../model/view-mode.enum';

import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';
import { AppViewService } from '../../services/content-view-mode.service';
import { StepService } from '../../services/set-steps.service';

@Component({
  selector: 'app-assessment-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit, OnDestroy 
{
  @Input() app: MicroAppStatus;

  /** Whether a user is viewing assessment content or general page content */
  pageView: Observable<PageViewMode>;
  pageViewMode = PageViewMode;

  /** Questions in an assessment */
  assessmentQuestions: AssessmentQuestion[];
  /** Assessment in progress */
  assessment: Assessment;
  /** Form declarations */
  assessmentFormArray: FormArray;
  assessmentForm: FormGroup;

  /** Tracking questions using stepper */
  currentStep = 0;
  /** Total number of next clicks (question array length) */
  totalSteps  = 0;
  /** How far a learner is in answering questions */
  progressPercentage = 0;
  stepperForm = true;
  /** Limit going back until progress is saved */
  canNavigate: boolean;
  /** Current MicroApp status */
  appStatus: MicroAppStatus
  questionResponses: QuestionResponse[]

  private _sBS = new SubSink()
  constructor ( private _assessFormService: MicroAppAssessmentQuestionFormService,
                private _pageViewservice: AppViewService,
                private _fb: FormBuilder,
                private stepService: StepService,
                private _microAppService: MicroAppManagementService,
                private _microApp$$: MicroAppStore,
  ){ }

  ngOnInit() {
    this.pageView = this._pageViewservice.getPageViewMode();
    
    this.buildForms();
    // Subscribe to changes when the navigation buttons are clicked for the stepper assessment form
    this._sBS.sink = this.stepService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
    // Progress UI
    this.getProgress();
  }

  /**Building assessment forms */
  buildForms(){
    this.assessmentFormArray = this._assessFormService.createMicroAppAssessment(this.assessmentQuestions);
    this.assessmentForm = this._fb.group({
      assessmentFormArray: this.assessmentFormArray
    });
    this.totalSteps = this.assessmentFormArray.controls.length;
    this.stepService.setTotalSteps(this.totalSteps);
  }

  /** Tracking how far a learner is in their assignment, for UI rendering  */
  getProgress(){
    this.progressPercentage = __CalculateProgress(this.assessmentFormArray);
  }
  
  /** Get the color for the progress bar */
  getProgressColor(progress: number): string {
    // Calculate the gradient stop position based on the progress percentage
    const gradientStopPosition = progress / 100;

    // Generate the linear gradient string
    return `linear-gradient(to right, white ${gradientStopPosition}%, #1F7A8C ${gradientStopPosition}%)`;
  }
  /** Navigate to previous question */
  prevStep()
  {
    this.canNavigate = false
    this.stepService.prevStep();
  }
  /** Navigate to the next question */
  nextStep(i: number)
  {
    this.saveProgress(i)
    this.stepService.nextStep();
  }

  async saveProgress(i: number)
  {
    const questionResponses: QuestionResponse[] = this.questionResponses || [];
    const selectedOption = this.assessmentFormArray?.controls[i].get('selectedOption')?.value
    const questionId = this.assessmentFormArray?.controls[i].get('id')?.value
    const textAnswer = this.assessmentFormArray?.controls[i].get('textAnswer')?.value
    let totalMarks
    const markScore = this.assessmentFormArray?.controls[i].get('marks')?.value
    const questionResponse: QuestionResponse = {
      questionId: questionId,
      answerId: selectedOption,
      answerText: textAnswer.text,
    }
    questionResponses.push(questionResponse);

    const progressMilestones: AssessmentProgressUpdate = {
      appId: this.appStatus.appId, 
      endUserId: this.appStatus.endUserId,
      orgId: this.appStatus.config.orgId,
      questionResponses: questionResponses,
      // Will need to be calculated
      timeSpent: new Date().getTime() - this.appStatus.startedOn!,
      type: MicroAppTypes.Assessment,
      assessmentDetails: {
        maxScore: totalMarks += markScore ,
        questionCount: this.totalSteps
      }

    }
    this._microAppService.progressCallBack(this.appStatus, progressMilestones);
  }

  ngOnDestroy()
   {
    this._sBS.unsubscribe();
  }
}
