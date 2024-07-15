import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { __CalculateProgress } from '../../utils/calculate-progress.util';
import { PageViewMode } from '../../model/view-mode.enum';

import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';
import { AppViewService } from '../../services/content-view-mode.service';


@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit 
{
  /** Whether a user is viewing assessment content or general page content */
  pageView: Observable<PageViewMode>;
  pageViewMode = PageViewMode;

  assessmentQuestions = []
  /** Form declarations */
  assessmentFormArray: FormArray;
  assessmentForm: FormGroup;

  /** Grading scores */
  passCriteria: any;
  /** Tracking questions using stepper */
  currentStep = 0;
  /** Total number of next clicks (question array length) */
  totalSteps  = 0;
  /* How far a learner is in answering questions */
  progressPercentage = 0;

  constructor ( private _assessFormService: MicroAppAssessmentQuestionFormService,
                private _pageViewservice: AppViewService,
                private _fb: FormBuilder,
  ){}

  ngOnInit() {
    this.pageView = this._pageViewservice.getPageViewMode();
    this.buildForms();
    this.getProgress();
  }

  /**Building assessment forms */
  buildForms(){
    this.assessmentFormArray = this._assessFormService.createMicroAppAssessment(this.assessmentQuestions);
    this.assessmentForm = this._fb.group({
      assessmentFormArray: this.assessmentFormArray
    });
    this.totalSteps = this.assessmentFormArray.controls.length;
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

  /** Changes the page view from home page to assessment mode
   *  TODO: Integrate timer and micro-app status setting
   */
  startAssignment(){
    this._pageViewservice.setPageViewMode(PageViewMode.AssessmentMode)
  }

  /** Previous question click */
  prevStep() 
  {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  /** Next question click */
  nextStep() 
  {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }
}