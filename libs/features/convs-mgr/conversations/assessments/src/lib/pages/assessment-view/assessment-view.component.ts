import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { flatten as __flatten } from 'lodash';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';


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
  }

  ngOnDestroy(): void {}
}
