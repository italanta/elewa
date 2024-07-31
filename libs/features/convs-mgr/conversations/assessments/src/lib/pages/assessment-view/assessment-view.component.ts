import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { flatten as __flatten } from 'lodash';

import { startWith, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentQuestion } from'@app/model/convs-mgr/conversations/assessments';
import { __CalculateProgress } from '../../utils/calculate-progress.util';

@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, AfterViewInit, OnDestroy
{

  @Input() assessmentForm: FormGroup;
  @Input() questions: AssessmentQuestion[];
  @Input() progressBarCallback: () => void;

  stepperForm: boolean;

  assessmentPreviewData: any = {};
  progressPercentage = 0
  assessmentFormArray: FormArray
  private _sBS = new SubSink();

  constructor() {}

  ngOnInit(): void {
    this.stepperForm = true
    // Subscribe to value changes to update progress// Initialize form array after the input properties are set
    if (this.assessmentForm) {
      this.assessmentFormArray = this.assessmentForm.get('questions') as FormArray;
    }
    this._sBS.sink =  this.assessmentForm.valueChanges.subscribe(() => {
      //Communicate progress to parent component and update progress UI
      this.progressBarCallback();
    });
  }

  ngAfterViewInit(): void {
    this.assessmentForm.valueChanges
                .pipe(startWith(this.assessmentForm.value),
                      tap(() => {
                        this.assessmentPreviewData = this.assessmentForm.value
                        // this.assessmentFormArray = this.assessmentForm.get('questions') as FormArray;
                      }      
                    ))
                .subscribe();
  }

  /** Get the color for the progress bar */
  getProgressColor(progress: number): string {
    // Calculate the gradient stop position based on the progress percentage
    const gradientStopPosition = progress / 100;

    // Generate the linear gradient string
    return `linear-gradient(to right, white ${gradientStopPosition}%, #1F7A8C ${gradientStopPosition}%)`;
  }


  ngOnDestroy(): void {}
}
