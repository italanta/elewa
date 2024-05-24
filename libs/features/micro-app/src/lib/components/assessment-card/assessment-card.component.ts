import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestion } from '../../models/assessment-question.interface';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.scss']
})
export class AssessmentCardComponent implements OnInit {
  @Input() assessmentQuestions: AssessmentQuestion[];
  @Input() assessmentFormArray: FormArray;
  @Input() assessmentForm: FormGroup;
  @Input() progressCallback: () => void;

  stepperForm = true

  /** Tracking questions using stepper */
  currentStep = 0;
  totalSteps  = 0;

  constructor(){}

  ngOnInit(): void {
    this.totalSteps = this.assessmentFormArray.controls.length
    // Subscribe to value changes to update progress
    this.assessmentFormArray.valueChanges.subscribe(() => {
      this.progressCallback();
    });

    // Initial progress calculation
    this.progressCallback();
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
