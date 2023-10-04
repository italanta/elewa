import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FeedbackType, Survey } from '@app/model/convs-mgr/conversations/surveys';

@Component({
  selector: 'app-survey-config',
  templateUrl: './survey-config.component.html',
  styleUrls: ['./survey-config.component.scss'],
})
export class SurveyConfigComponent {
  @Input() survey: Survey;
  @Input() surveyMode: number
  @Input() surveyFormGroup: FormGroup;

  @Input() previewMode: boolean;

  immediateFeedback = FeedbackType.Immediately;
  onEndFeedback = FeedbackType.OnEnd;
  noFeedback = FeedbackType.Never;
}
