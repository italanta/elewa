import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { __CalculateProgress } from '../../utils/calculate-progress.util';
import { PageViewMode } from '../../model/view-mode.enum';

import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';
import { AppViewService } from '../../services/content-view-mode.service';
import { StepService } from '../../services/set-steps.service';


@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit, OnDestroy 
{
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

  private _sBS = new SubSink()
  constructor ( private _assessFormService: MicroAppAssessmentQuestionFormService,
                private _pageViewservice: AppViewService,
                private _fb: FormBuilder,
                private stepService: StepService,
  ){ }

  ngOnInit() {
    this.pageView = this._pageViewservice.getPageViewMode();
    this.buildForms();
    this._sBS.sink = this.stepService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
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

  /** Tracking how far a learner is in their assignment  */
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
    this.stepService.prevStep();
  }
  /** Navigate to the next question */
  nextStep()
  {
    this.stepService.nextStep();
  }

  ngOnDestroy()
   {
    this._sBS.unsubscribe();
  }
}