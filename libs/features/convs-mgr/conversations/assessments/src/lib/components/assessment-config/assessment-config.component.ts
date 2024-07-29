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
  retryOnCount = RetryType.onCount
  scoreRetry = RetryType.OnScore
  singleDisplay = QuestionDisplayed.Single
  multipleDisplay = QuestionDisplayed.Multiple
  moveOnPass: MoveOnCriteriaTypes.OnPassMark
  moveOnComplete: MoveOnCriteriaTypes.OnComplete
  private _sbS = new SubSink()

  ngOnInit(): void {
    this._sbS.sink = this.moveOnPassControl.valueChanges.subscribe();
  }
  
  get moveOnPassControl() {
    return this.assessmentFormGroup.get('configs.moveOnCriteria.criteria') as FormControl;
  }
  /** Turn retry on or off.  */
  toggleRetry(): void {
    this.retry = !this.retry
  }

  /** If a user disables retry, clear out previous retry configurations */
  clearControls(): void {
    this.assessmentFormGroup.get('configs.retryConfig.type')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onCount')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onScore.minScore')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onScore.count')?.setValue(null);
  }

  get isDefaultRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryConfig.type')?.value === this.retryOnCount;
  }

  get isScoreRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryConfig.type')?.value === this.scoreRetry;
  }

  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }
}
