import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { StepService } from '../../services/set-steps.service';
import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';


@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.scss']
})
export class AssessmentCardComponent implements OnInit, OnDestroy
{
  @Input() assessmentForm: FormGroup;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;
  /** Method called to track progress */
  @Input() progressBarCallback: () => void;
  /** Toggle between all questions view or single question view */
  @Input() stepperForm: boolean;
  
  private _sBS = new SubSink();

  constructor( ){}

  ngOnInit(): void 
  {
    // Subscribe to value changes to update progress
    this._sBS.sink =  this.assessmentFormArray.controls[0].get('selectedOption')?.valueChanges.subscribe(() => {
      //Communicate progress to parent component and update progress UI
      this.progressBarCallback();
    });
  }

  /** Unsubscribe from all observables */
  ngOnDestroy(): void {
      this._sBS.unsubscribe()
  }
}
