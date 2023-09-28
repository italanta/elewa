import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { startWith, tap } from 'rxjs';

import { flatten as __flatten } from 'lodash';

import { Assessment, AssessmentQuestion } from'@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, AfterViewInit, OnDestroy
{

  @Input() assessmentForm: FormGroup;
  @Input() questions: AssessmentQuestion[];

  assessmentPreviewData: any = {};

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.assessmentForm.valueChanges
                .pipe(startWith(this.assessmentForm.value),
                      tap(() => this.assessmentPreviewData = this.assessmentForm.value))
                .subscribe();
  }

  ngOnDestroy(): void {}
}
