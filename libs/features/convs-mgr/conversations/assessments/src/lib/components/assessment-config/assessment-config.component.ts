import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { Assessment, FeedbackType, MoveOnCriteriaTypes, QuestionDisplayed, RetryType } from '@app/model/convs-mgr/conversations/assessments';

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
  /** Can retry for given number of times */
  retryOnCount = RetryType.onCount;
  /** Retry based on score */
  scoreRetry = RetryType.OnScore;
  /** Only display one question on form */
  singleDisplay = QuestionDisplayed.Single;
  /** Display multiple questions on form*/
  multipleDisplay = QuestionDisplayed.Multiple;
  /** Step to take on story if a learner passes */
  moveOnPass = MoveOnCriteriaTypes.OnPassMark;
  /** Step to take on story if a learner completes an assesmment */
  moveOnComplete = MoveOnCriteriaTypes.OnComplete;

  private _sbS = new SubSink();

  ngOnInit(): void 
  {
    this.setRetryState();
    this._sbS.sink = this.moveOnPassControl.valueChanges.subscribe();
  }
  
  /** get form controll for assessment passed */
  get moveOnPassControl() {
    return this.assessmentFormGroup.get('configs.moveOnCriteria.criteria') as FormControl;
  }

  /** Get the state of the retry toggle */
  setRetryState(): void {
    const retryControl = this.assessmentFormGroup.get('configs.retryConfig.type');
    if (retryControl) {
      this.retry = !!retryControl.value;
    }
  }

  /** Turn retry on or off.  */
  toggleRetry(event: any): void {
    const retryControl = this.assessmentFormGroup.get('configs.retryConfig.type');
    if (retryControl) {
      this.retry = event.checked;
      if (!this.retry) {
        retryControl.setValue('');
        this.clearControls();
      }
    }
  }

  /** If a user disables retry, clear out previous retry configurations */
  clearControls(): void {
    this.assessmentFormGroup.get('configs.retryConfig.type')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onCount')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onScore.minScore')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onScore.count')?.setValue(null);
  }

  /** Retry based on number */
  get isDefaultRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryConfig.type')?.value === this.retryOnCount;
  }

  /** Control for retry set on score */
  get isScoreRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryConfig.type')?.value === this.scoreRetry;
  }
/** Unsubscribe from all subscriptions */
  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }
}
