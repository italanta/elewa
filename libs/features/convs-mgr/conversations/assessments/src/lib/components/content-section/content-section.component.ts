import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { combineLatest, map, take } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentOptionValue, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppProgress, MicroAppStatus, MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentProgress, AssessmentProgressUpdate, AssessmentStatusTypes, QuestionResponse, QuestionResponseMap } from '@app/model/convs-mgr/micro-app/assessments';
import { MicroAppManagementService } from '@app/state/convs-mgr/micro-app';
import { AssessmentQuestionStore, AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';

import { __CalculateProgress } from '../../utils/calculate-progress.util';
import { AssessmentPageViewMode } from '../../model/view-mode.enum';

import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';
import { StepService } from '../../services/set-steps.service';

@Component({
  selector: 'app-assessment-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit, OnDestroy 
{
  @Input() app: MicroAppStatus;
  logoUrl: string;
  /** Whether a user is viewing assessment content or general page content */
  pageViewMode = AssessmentPageViewMode.AssessmentMode;
  assessmentProgress: AssessmentProgress;

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
  stepperForm: boolean;
  /** Limit going back until progress is saved */
  canNavigate: boolean;
  /** Configs for header components: startTime and assessmentTitle */
  startTime: number;
  assessmentTitle: string;

  questionResponses: QuestionResponse[]
  isLoading = true;
  isSubmitting: boolean;

  private _sBS = new SubSink()
  constructor ( private _assessFormService: MicroAppAssessmentQuestionFormService,
                private _fb: FormBuilder,
                private stepService: StepService,
                private _microAppService: MicroAppManagementService,
                private _assessmentQuestionStore: AssessmentQuestionStore,
                private _assessmentStore$: AssessmentsStore,
  ){ }

  ngOnInit() {
    
    if(this.app) {
      this.logoUrl = this.app.config.orgLogoUrl as string;
      this.getAssessment();
      this.getAssessmentQuestions(this.app.config.orgId);
      this.startTime = new Date().getTime() as number;
    }    
    // Subscribe to changes when the navigation buttons are clicked for the stepper assessment form
    this._sBS.sink = this.stepService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });

  }

  /** Fetch micro-app assessment and use config object to render either stepper form or all questions form */
  getAssessment()
  {
    this._assessmentStore$.getAssessmentByOrg(this.app.appId, this.app.config.orgId).subscribe(_assessment => {
      this.assessment = _assessment;
      this.assessmentTitle = this.assessment.title;
      this.assessment.configs?.questionsDisplay === 1? this.stepperForm = true: this.stepperForm = false;
    })
  }
  /** Fetch assessment Questions */
  getAssessmentQuestions (orgId: string)
  {
    const progress$ = this._assessmentQuestionStore.getAssessmentProgress(this.app.appId, orgId, this.app.endUserId);
    const questions$ = this._assessmentQuestionStore.getQuestionsByAssessment(this.app.appId, orgId);

    let questionResponses: QuestionResponseMap | undefined;
    this._sBS.sink = combineLatest([progress$, questions$]).pipe(take(1),map(([progress, questions])=> {
          this.assessmentProgress = progress
          // If the assessment is in progress we append user answer responses
          if(progress) {
            const attemptNumber = progress.attemptCount;
            const currentAttempt = progress.attempts[attemptNumber]
            // If the current attempt finished, we start a new attempt without the question responses
            questionResponses = !currentAttempt.finishedOn ? currentAttempt.questionResponses : undefined;

          }
          this.assessmentQuestions = questions;
          this.buildForms(questionResponses)
          this.isLoading = false
      })).subscribe();
  }

  /**Building assessment forms */
  buildForms(questionResponses?: QuestionResponseMap){
    this.assessmentFormArray = this._assessFormService.createMicroAppAssessment(this.assessmentQuestions, questionResponses);
    this.assessmentForm = this._fb.group({
     questions: this.assessmentFormArray
    });
    this.getProgressBar()
    this.totalSteps = this.assessmentFormArray.controls.length;
    this.stepService.setTotalSteps(this.totalSteps);
  }

  /** Tracking how far a learner is in their assignment, for UI rendering  */
  getProgressBar(){
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
    this.assessmentFormArray.at(i).get('selectedOption')?.markAsTouched();
    if (!this.assessmentFormArray.at(i).get('selectedOption')?.valid) return
    if(this.assessmentFormArray.at(i).get('selectedOption')?.valid){
      this.saveProgress(i)
      setTimeout(() => {
        this.stepService.nextStep();
      }, 1000);
    }
  }

  /** Update a learner's progress
   *  Track the answered questions and store them in a responses array
   *  When on the last question, redirect them back to platform
   */
  saveProgress(i?: number) {
    const isLastStep = this.stepperForm 
      ? this.currentStep === this.totalSteps - 1 
      : true; // If not stepper mode, treat the form as if it's the last step
  
    // Ensure we are using a persistent `this.questionResponses` and not resetting it each time
    if (!this.questionResponses) {
      this.questionResponses = []; // Initialize if not already
    }
  
    const processQuestion = (control: AbstractControl) => {
      control.get('selectedOption')?.markAsTouched();
  
      if (!control.get('selectedOption')?.valid) return;
  
      const selectedOptionId = control.get('selectedOption')?.value;
      const questionId = control.get('id')?.value;
      const questionMarks = control.get('marks')?.value;
      const textAnswer = control.get('textAnswer')?.value;
  
      const question = this.assessmentQuestions.find((q) => q.id === questionId);
      const correctAnswer = question?.options?.find((op) => op.accuracy === AssessmentOptionValue.Correct);
      const selectedOption = question?.options?.find((op) => op.id === selectedOptionId);
  
      const questionResponse: QuestionResponse = {
        questionId: questionId,
        answerId: selectedOption?.id,
        answerText: selectedOption ? selectedOption.text : textAnswer,
        marks: parseInt(questionMarks),
        correctAnswer: correctAnswer?.id,
      };
  
      // Find if the question was already answered, and update it instead of duplicating
      this.questionResponses[this.questionResponses.findIndex(qr => qr.questionId === questionId)] = questionResponse;
    };
  
    // Handle stepper mode or all-questions mode
    if (!this.stepperForm) {
      this.assessmentFormArray?.controls.forEach(processQuestion);
    } else {
      const control = this.assessmentFormArray?.controls[i!];
      processQuestion(control);
    }
  
    const progressMilestones: AssessmentProgressUpdate = {
      appId: this.app.appId,
      endUserId: this.app.endUserId,
      orgId: this.app.config.orgId,
      questionResponses: this.questionResponses,  // Persisting the questionResponses array
      timeSpent: new Date().getTime() - this.app.startedOn!,
      type: MicroAppTypes.Assessment,
      assessmentDetails: {
        maxScore: this.assessment.maxScore,
        questionCount: this.totalSteps,
        moveOnCriteria: this.assessment.configs?.moveOnCriteria,
        title: this.assessment.title,
        storyId: this.app.config.storyId,
        moduleId: this.app.config.moduleId,
        botId: this.app.config.botId,
      },
      endUserName: this.app.endUserName,
      hasSubmitted: isLastStep,
    };
    this.isSubmitting = isLastStep;
    this.subscribeToProgress(progressMilestones);
  }
  
   private subscribeToProgress (milestones: MicroAppProgress)
  {
    this._microAppService.progressCallBack(this.app, milestones)?.pipe(take(1)).subscribe((updatedProgress) => {
      if (updatedProgress) {
        this.assessmentProgress = updatedProgress.result as AssessmentProgress;
        const currentAttempt = this.assessmentProgress.attempts[this.assessmentProgress.attemptCount];

        // Only change the view to results page if the whole assessment has been submitted
        if(this.isSubmitting && currentAttempt.outcome !== AssessmentStatusTypes.Incomplete) {
          this.isSubmitting = false;
          this.stepService.setStep(0);
          this.pageViewMode = AssessmentPageViewMode.ResultsMode;
        }
      }
    });
  }

  ngOnDestroy()
   {
    this._sBS.unsubscribe();
  }
}
