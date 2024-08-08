import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { Observable, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { StepService } from '../../services/set-steps.service';

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

  /** Current question view clicked */
  currStep$: Observable<number>;
  /** Index / position of current question */
  currentStep: number;
  /** Trackiing state of data load */
  stepDataLoaded = false;

  private _sbS = new SubSink();

  constructor( private _stepServ: StepService){}

  ngOnInit(): void {
    this._sbS.sink = this._stepServ.currentStep$
                                      .pipe(
                                          tap((s) => { 
                                            this.currentStep = s;
                                            this.stepDataLoaded = true;
                                          })
                            ).subscribe();
  }
}
