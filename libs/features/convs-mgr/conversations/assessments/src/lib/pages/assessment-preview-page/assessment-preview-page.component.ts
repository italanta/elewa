import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { StepService } from '../../services/set-steps.service';
import { __CalculateProgress } from '../../utils/calculate-progress.util';
import { AssessmentPageViewMode } from '../../model/view-mode.enum';

import { AssessmentConfiguration, AssessmentQuestion, RetryConfig, RetryType } from '@app/model/convs-mgr/conversations/assessments';
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
  retryType: RetryType;
  minScore: number;

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
    if (this.assessmentForm) {
      console.log(this.assessmentForm);
      this.assessmentFormArray = this.assessmentForm.get('questions') as FormArray;
      this.getProgressBar();
      this.totalSteps = this.assessmentFormArray.controls.length;
      console.log(this.totalSteps);
      this.stepService.setTotalSteps(this.totalSteps);
      this.getRetryControls();
    }

    this._sBS.sink = this.stepService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
  }

  ngAfterViewInit(): void {
    this.updateFormControls();
  }

  updateFormControls() {
    if (this.assessmentFormArray) {
      this.assessmentFormArray.controls.forEach((control, index) => {
        control.enable(); 
      });
    }
  }

  getProgressBar() {
    this.progressPercentage = __CalculateProgress(this.assessmentFormArray);
  }

  getProgressColor(progress: number): string {
    const gradientStopPosition = progress / 100;
    return `linear-gradient(to right, white ${gradientStopPosition}%, #1F7A8C ${gradientStopPosition}%)`;
  }

  prevStep() {
    this.stepService.prevStep();
  }

  nextStep(i: number) {
    this.assessmentFormArray.at(i).get('selectedOption')?.markAsTouched();
    if (!this.assessmentFormArray.at(i).get('selectedOption')?.valid) return;
    if (this.assessmentFormArray.at(i).get('selectedOption')?.valid) {
      this.stepService.nextStep();
    }
  }

  saveProgress(currentStep: number) {
    this.pageViewMode = AssessmentPageViewMode.ResultsMode;
  }

  getRetryControls() {
    if (this.assessmentForm) {
      const config = this.assessmentForm.get('configs')?.value as AssessmentConfiguration
      const retryConfig = config.retryConfig as RetryConfig
      console.log(this.assessmentForm);
      console.log(this.totalSteps);
      console.log(retryConfig);
      this.retryType = retryConfig.type;
      const formType = config.questionsDisplay
      if(formType === 1){
        this.stepperForm = true
      }

    }
  }

  buildForm(assessmentQuestions: AssessmentQuestion) {
    return this._assessFormService.createAssessmentQuestionForm(assessmentQuestions);
  }

  retryAssessment() {
    //
  }
}

