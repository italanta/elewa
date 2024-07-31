import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { StepService } from '../../services/set-steps.service';
import { __CalculateProgress } from '../../utils/calculate-progress.util';

@Component({
  selector: 'app-assessment-preview-page',
  templateUrl: './assessment-preview-page.component.html',
  styleUrl: './assessment-preview-page.component.scss',
})
export class AssessmentPreviewPageComponent implements OnInit  
{
  @Input() assessmentForm: FormGroup;
  assessmentFormArray: FormArray;
  /** Tracking questions using stepper */
  currentStep = 0;
  /** Total number of next clicks (question array length) */
  totalSteps  = 0;
  /** How far a learner is in answering questions */
  progressPercentage = 0;
  stepperForm: boolean;

  private _sBS = new SubSink()

  constructor (private stepService: StepService,){}

  ngOnInit(): void {
    if(this.assessmentForm){
      this.assessmentFormArray = this.assessmentForm.get('questions') as FormArray;
      this.getProgressBar()
      this.totalSteps = this.assessmentFormArray.controls.length;
      this.stepService.setTotalSteps(this.totalSteps)
    } 
      // Subscribe to changes when the navigation buttons are clicked for the stepper assessment form
    this._sBS.sink = this.stepService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
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
    this.stepService.prevStep();
  }
  
  /** Navigate to the next question */
  nextStep(i: number)
  {
    this.assessmentFormArray.at(i).get('selectedOption')?.markAsTouched();
    if (!this.assessmentFormArray.at(i).get('selectedOption')?.valid) return
    if(this.assessmentFormArray.at(i).get('selectedOption')?.valid){
      this.stepService.nextStep();
    }
  }

  saveProgress(currentStep: number){

  }
}
