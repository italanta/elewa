import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Assessment, FeedbackType, QuestionDisplayed, RetryType } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-config',
  templateUrl: './assessment-config.component.html',
  styleUrls: ['./assessment-config.component.scss'],
})
export class AssessmentConfigComponent {
  @Input() assessment: Assessment;
  @Input() assessmentMode: number
  @Input() assessmentFormGroup: FormGroup;

  @Input() previewMode: boolean;
  /** If a user can retry an assignment  */
  retry: boolean

  /** Radio control values */
  immediateFeedback = FeedbackType.Immediately;
  onEndFeedback = FeedbackType.OnEnd;
  noFeedback = FeedbackType.Never;
  defaultRetry = RetryType.Default
  scoreRetry = RetryType.OnScore
  singleDisplay = QuestionDisplayed.Single
  multipleDisplay = QuestionDisplayed.Multiple
  
  toggleRetry(){
    this.retry = !this.retry
  }
}
