import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { flatten as __flatten } from 'lodash';

import { startWith, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { AssessmentQuestion } from'@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, AfterViewInit, OnDestroy
{

  @Input() assessmentForm: FormGroup;
  @Input() questions: AssessmentQuestion[];
  @Input() assessmentFormArray: FormArray;
  @Input() progressBarCallback: () => void;

  stepperForm: boolean;

  assessmentPreviewData: any = {};

  private _sBS = new SubSink();

  constructor() {}

  ngOnInit(): void {
    this.stepperForm = true
    this.assessmentFormArray = this.assessmentForm.get('questions') as FormArray;
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


  ngOnDestroy(): void {}
}
