import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';

@Component({
  selector: 'app-survey-view',
  templateUrl: './survey-view.component.html',
  styleUrls: ['./survey-view.component.scss'],
})
export class SurveyViewComponent implements OnInit, OnDestroy{
  @Input() previewMode: boolean;
  @Input() surveyForm: FormGroup;
  @Input() questions: SurveyQuestion[];

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
