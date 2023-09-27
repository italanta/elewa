import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { flatten as __flatten } from 'lodash';

@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, OnDestroy
{

  @Input() previewMode: boolean;
  @Input() assessmentForm: FormGroup;
  @Input() questions: AssessmentQuestion[];

  constructor() {}

  ngOnInit(): void {
    console.warn("freoeo", this.assessmentForm)
  }

  ngOnDestroy(): void {}
}
