import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentStatusTypes, Attempt, QuestionResponseMap } from '@app/model/convs-mgr/micro-app/assessments';
import { AssessmentConfiguration, AssessmentQuestionOptions, RetryConfig, RetryType } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentPageViewMode } from '../../model/view-mode.enum';
import { StepService } from '../../services/set-steps.service';
import { __CalculateProgress } from '../../utils/calculate-progress.util';
import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';

@Component({
  selector: 'app-assessment-preview-page',
  templateUrl: './assessment-preview-page.component.html',
  styleUrls: ['./assessment-preview-page.component.scss'],
})
export class AssessmentPreviewPageComponent implements OnInit, AfterViewInit {
  @Input() assessmentForm: FormGroup;
  assessmentFormArray: FormArray;
  currentStep = 0;
  totalSteps = 0;
  progressPercentage = 0;
  stepperForm: boolean;
  pageViewMode: number;
  allowedAttempts: number;
  retryConfig: RetryConfig;
  retryType: RetryType;
  minScore: number;
  isCompleted: boolean;
  currentProgress: Attempt;
  score: number;

  resultsMode = {
    failedAndNoRetries: false,
    failedAndHasRetries: false,
    passedAndHasRetries: false,
    passedAndNoRetries: false,
  };

  private _sBS = new SubSink();

  constructor(
    private stepService: StepService,
    private _assessFormService: MicroAppAssessmentQuestionFormService
  ) {}

  ngOnInit(): void {
    //Build the assessment form array and assign total steps based on controls.
    if (this.assessmentForm) {
      this.assessmentFormArray = this.assessmentForm.get('questions') as FormArray;
      this.getProgressBar();
      this.totalSteps = this.assessmentFormArray.controls.length;
      this.stepService.setTotalSteps(this.totalSteps);
      this.getRetryControls();
    }
    // Always update steps in an assessment
    this._sBS.sink = this.stepService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
  }
  /** Use ngAfterViewInit to enable form controls  */
  ngAfterViewInit(): void 
  {
    this.assessmentFormArray?.controls.forEach(control => control.enable());
  }
  /** Methods below are for updating the progress UI */
  getProgressBar() {
    this.progressPercentage = __CalculateProgress(this.assessmentFormArray);
  }

  getProgressColor(progress: number): string {
    const gradientStopPosition = progress / 100;
    return `linear-gradient(to right, white ${gradientStopPosition}%, #1F7A8C ${gradientStopPosition}%)`;
  }
  /** Check and fetch conditions for assessment retrial, if present */
  getRetryControls() {
    if (this.assessmentForm) {
      const config = this.assessmentForm.get('configs')?.value as AssessmentConfiguration
      this.retryConfig = config.retryConfig as RetryConfig;
      this.retryType = config.retryConfig?.type as RetryType;
      const formType = config.questionsDisplay
      if(formType === 1){
        this.stepperForm = true
      }else{
        this.stepperForm = false
      }
    }
  }

  prevStep() {
    this.stepService.prevStep();
  }
  /** Update answers as a learner moves along a form */
  nextStep(i: number) {
    this.assessmentFormArray.at(i).get('selectedOption')?.markAsTouched();
    if (!this.assessmentFormArray.at(i).get('selectedOption')?.valid) return;
    if (this.assessmentFormArray.at(i).get('selectedOption')?.valid) {
      this.saveProgress(i)
      this.stepService.nextStep();
    }
  }
  /** Saving a learner's progress depending on the view mode */
  saveProgress(currentStep: number) 
  {
    // If stepper form is enabled, only save the current step's progress
    if (this.stepperForm) {
      this.saveQuestionProgress(currentStep);
  } else {
      // If all questions are displayed, save progress for all questions
      for (let i = 0; i < this.totalSteps; i++) {
          this.saveQuestionProgress(i);
      }
      this.isCompleted = true;
      this.updateResultModeAndRetries();
    }
  }
  /** Building the assessment progress object */
  saveQuestionProgress(index: number) {
    const questionFormGroup = this.assessmentFormArray.at(index) as FormGroup;
    const questionId = questionFormGroup.get('id')?.value;
    const selectedOptionId = questionFormGroup.get('selectedOption')?.value;
    const answerText = questionFormGroup.get('message')?.value;
    const marks = questionFormGroup.get('marks')?.value;
    const options = questionFormGroup.get('options')?.value;
    const questionResponses = this.currentProgress?.questionResponses || {};
    const correctOption = options.find((option: any) => option.accuracy === 1);
    const isCorrect = correctOption?.id === selectedOptionId;

    questionResponses[questionId] = {
        questionId: questionId,
        answerText: answerText,
        answerId: selectedOptionId,
        marks: marks,
        correct: isCorrect,
        score: isCorrect ? marks : 0,
    };

    this.currentProgress = {
        ...this.currentProgress,
        questionResponses: questionResponses,
        score: this.calculateScore(questionResponses)
    };
}
  /** Looping over each answered question to get the scores */
  private calculateScore(questionResponses: QuestionResponseMap): number {
    let totalScore = 0;
    let maxScore = 0;

    Object.values(questionResponses).forEach(response => {
      totalScore += response.correct ? response.marks || 0 : 0;
      maxScore += response.marks || 0; // Sum up the maximum possible marks
    });
    const scorePercentage = (totalScore / maxScore) * 100;
    this.score = Math.round(scorePercentage);
    return scorePercentage;
  }

  
  /** Conditional rendering of different feedback state views */
  updateResultModeAndRetries() {
    let passed;
    if (this.minScore) {
      passed = this.currentProgress.score >= this.minScore;
    } else {
      passed = this.currentProgress.score > 50
    }

    if (passed) {
      this.currentProgress.outcome = AssessmentStatusTypes.Passed;
    } else {
      this.currentProgress.outcome = AssessmentStatusTypes.Failed;
    }

    if (this.allowedAttempts > 0 && this.retryType === RetryType.OnScore && !passed) {
      this.resultsMode.failedAndHasRetries = true;
    } else if (this.allowedAttempts > 0 && this.retryType === RetryType.OnScore && passed) {
      this.resultsMode.passedAndHasRetries = true;
    } else if (this.allowedAttempts > 0 && this.retryType === RetryType.onCount) {
      this.resultsMode.failedAndHasRetries = !passed;
      this.resultsMode.passedAndHasRetries = passed;
    } else {
      this.resultsMode.failedAndNoRetries = !passed;
      this.resultsMode.passedAndNoRetries = passed;
    }

    this.pageViewMode = AssessmentPageViewMode.ResultsMode;
  }
  /** Handle mock assessment retrial */
  retryAssessment() {
    if (this.allowedAttempts > 0) {
      this.allowedAttempts--;
      this.pageViewMode = AssessmentPageViewMode.AssessmentMode;
      this.currentStep = 0;
      // this.stepService.setCurrentStep(this.currentStep);
    }
  }

  /** Method to get feedback for a selected option */
  getOptionFeedback(question: AbstractControl): string {
    const selectedOption = question.get('selectedOption')?.value;
    const options = question.get('options')?.value;
    const selectedOptionDetails = options.find((option: { id: string }) => option.id === selectedOption);
 
    return selectedOptionDetails ? selectedOptionDetails.feedback : '';
  }
 
  /** Checking if an answer is right or wrong, to style option accordingly */
  isWrongAnswer(question: AbstractControl, option: AssessmentQuestionOptions): boolean 
  {
    const selectedOption = question.get('selectedOption')?.value;
    if (!selectedOption) {
      return false;
    }
    const isSelected = selectedOption === option.id;
    const isAccurate = option.accuracy === 1; 
  
    return isSelected && !isAccurate;
  }
}
