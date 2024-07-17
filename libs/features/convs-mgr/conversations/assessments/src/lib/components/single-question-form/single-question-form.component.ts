import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-single-question-form',
  templateUrl: './single-question-form.component.html',
  styleUrl: './single-question-form.component.scss'
})
export class SingleQuestionFormComponent implements OnInit
{
  /** Asssessments form group */
  @Input() assessmentForm: FormGroup;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;
  /** Tracking questions using stepper */
  currentStep = 0;
  /** Total number of next clicks (question array length) */
  totalSteps  = 0;

  ngOnInit(): void 
  {
    this.totalSteps = this.assessmentFormArray.controls.length;
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
