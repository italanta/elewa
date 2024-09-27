import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { Observable, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { StepService } from '../../services/set-steps.service';
import { getMediaType } from '../../utils/check-media-type.util';

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

  /** Expected media type */
  mediaType: 'image' | 'video';

  /** Track media state */
  isImage: boolean

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

                            console.log(this.assessmentFormArray)
  }

  /** Get media type for the current question */
  getMediaTypeForQuestion(mediaPath: string): 'image' | 'video' {
    return getMediaType(mediaPath) as 'image' | 'video';
  }
}
