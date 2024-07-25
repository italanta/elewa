import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { Assessment, FeedbackType, QuestionDisplayed, RetryType } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-config',
  templateUrl: './assessment-config.component.html',
  styleUrls: ['./assessment-config.component.scss'],
})
export class AssessmentConfigComponent implements OnInit, OnDestroy
{
  @Input() assessment: Assessment;
  @Input() assessmentMode: number;
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
    this._sbS.sink =  this.assessmentFormGroup?.get('configs.canRetry')?.valueChanges.subscribe((value) => {
      this.retry = value;

      if (!value) {
        this.clearControls();
      }
    });
  }
  
  /** Turn retry on or off.  */
  toggleRetry(): void {
    const canRetryControl = this.assessmentFormGroup.get('configs.canRetry');
    if (canRetryControl) {
     this.retry = canRetryControl.value;
    }
  }

  /** If a user disables retry, clear out previous retry configurations */
  clearControls(): void {
    this.assessmentFormGroup.get('configs.retryType')?.setValue(null);
    this.assessmentFormGroup.get('configs.userAttempts')?.setValue(null);
    this.assessmentFormGroup.get('configs.scoreAttempts.minScore')?.setValue(null);
    this.assessmentFormGroup.get('configs.scoreAttempts.userAttempts')?.setValue(null);
  }

  get isDefaultRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryType')?.value === this.retryOnCount;
  }

  get isScoreRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryType')?.value === this.scoreRetry;
  }

  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }
}
