import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MicroAppAssessmentQuestion } from '@app/model/convs-mgr/micro-app/base';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.scss']
})
export class AssessmentCardComponent implements OnInit 
{
  /** List of questions passed down by content page */
  @Input() assessmentQuestions: MicroAppAssessmentQuestion[];
  /** Form array when view mode is single question */
  @Input() assessmentFormArray: FormArray;
  @Input() assessmentForm: FormGroup;

  /** Method called to track progress */
  @Input() progressCallback: () => void;

  stepperForm = true

  /** Tracking questions using stepper */
  currentStep = 0;
  totalSteps  = 0;

  constructor(){}

  ngOnInit(): void 
  {
    this.totalSteps = this.assessmentFormArray.controls.length
    console.log(this.assessmentQuestions, 'logged from a card')
    // Subscribe to value changes to update progress
    this.assessmentForm.valueChanges.subscribe(() => {
      this.progressCallback();
    });
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  
  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }
  
}
