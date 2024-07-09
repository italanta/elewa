import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';

import { AssessmentQuestion } from '../../model/assessment-question.interface';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.scss']
})
export class AssessmentCardComponent implements OnInit, OnDestroy
{
  /** Array of all questions in an assessment */
  @Input() assessmentQuestions: AssessmentQuestion[];
  /** Asssessments form group */
  @Input() assessmentForm: FormGroup;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;
  /** Method called to track progress */
  @Input() progressCallback: () => void;
  /** Toggle between all questions view or single question view */
  stepperForm = true
  
  private _sBS = new SubSink();

  constructor(){}

  ngOnInit(): void 
  {
    // Subscribe to value changes to update progress
    this._sBS.sink =  this.assessmentForm.valueChanges.subscribe(() => {
      //Communicate progress to parent component and update progress UI
      this.progressCallback();
    });
  }

  /** Unsubscribe from all observables */
  ngOnDestroy(): void {
      this._sBS.unsubscribe()
  }
}
