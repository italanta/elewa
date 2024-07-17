import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { StepService } from '../../services/set-steps.service';

import { MicroAppAssessmentQuestion } from '@app/model/convs-mgr/micro-app/base';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.scss']
})
export class AssessmentCardComponent implements OnInit, OnDestroy
{
  /** List of questions passed down by content page */
  @Input() assessmentQuestions: MicroAppAssessmentQuestion[];
  /** Form array when view mode is single question */
  @Input() assessmentFormArray: FormArray;
  @Input() assessmentForm: FormGroup
  /** Method called to track progress */
  @Input() progressCallback: () => void;
  /** Toggle between all questions view or single question view */
  @Input() stepperForm: boolean;
  
  private _sBS = new SubSink();

  constructor( private stepServ: StepService){}

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
