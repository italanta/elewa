import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Assessment, FeedbackType, QuestionDisplayed, RetryType } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-config',
  templateUrl: './assessment-config.component.html',
  styleUrls: ['./assessment-config.component.scss'],
})
export class AssessmentConfigComponent implements OnInit{
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
  retryOnCount = RetryType.onCount
  scoreRetry = RetryType.OnScore
  singleDisplay = QuestionDisplayed.Single
  multipleDisplay = QuestionDisplayed.Multiple

  ngOnInit(): void {
    this.retry = this.assessmentFormGroup?.get('configs.canRetry')?.value;
  }
  
  toggleRetry(){
    const canRetry = this.assessmentFormGroup?.get('configs.canRetry')?.value;
    this.assessmentFormGroup.get('configs.canRetry')?.setValue(!canRetry);
    this.retry = !canRetry;
  }

  get isDefaultRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryType')?.value === this.retryOnCount;
  }

  get isScoreRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryType')?.value === this.scoreRetry;
  }

}
