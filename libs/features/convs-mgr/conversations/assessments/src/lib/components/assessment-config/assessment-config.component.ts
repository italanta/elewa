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
  retry: boolean;

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

  ngOnInit(): void {
    this.setRetryState();

    if (!this.assessmentFormGroup.get('configs.questionsDisplay')?.value) {
      this.assessmentFormGroup.get('configs.questionsDisplay')?.setValue(this.singleDisplay);
    }

    if (!this.assessmentFormGroup.get('configs.moveOnCriteria.criteria')?.value) {
      this.assessmentFormGroup.get('configs.moveOnCriteria.criteria')?.setValue(this.moveOnPass);
    }
  }
  
  /** get form controll for assessment passed */
  get moveOnCriteriaControl() {
    return this.assessmentFormGroup.get('configs.moveOnCriteria.criteria') as FormControl;
  }

  get retryTypeControl() {
    return this.assessmentFormGroup.get('configs.retryConfig.type') as FormControl;
  }

  // Control to manipulate form UI 

  /** Get story flow control based on passing an assessment */
  get isScoreFlow (){
    return this.assessmentFormGroup?.get('configs.moveOnCriteria.criteria')?.value === this.moveOnPass
  }

  /** Get story flow control based on completing an assessment */
  get isCompleteFlow (){
    return this.assessmentFormGroup?.get('configs.moveOnCriteria.criteria')?.value === this.moveOnComplete
  }
  
  /** Retry based on number */
  get isDefaultRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryConfig.type')?.value === this.retryOnCount;
  }

  /** Control for retry set on score */
  get isScoreRetrySelected(): boolean {
    return this.assessmentFormGroup?.get('configs.retryConfig.type')?.value === this.scoreRetry;
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
  
  onRetryTypeChange(type: RetryType): void {
    if (type === this.retryOnCount) {
      this.clearScoreRetryControls();
    } else if (type === this.scoreRetry) {
      this.clearDefaultRetry();
    }
  }
  
  //
  // SECTION TO CLEAR CONTROLS
  // 
  // STORY FLOW CONTROLS
  clearMoveOnPassControls(): void {
    this.assessmentFormGroup.get('configs.moveOnCriteria.passMark')?.setValue(null);
    this.assessmentFormGroup.get('configs.moveOnCriteria.criteria')?.setValue(this.moveOnComplete);
  }

  clearMoveOnCompleteControls() {
    this.assessmentFormGroup.get('configs.moveOnCriteria.criteria')?.setValue(this.moveOnPass);
    this.assessmentFormGroup.get('configs.moveOnCriteria.passMark')?.setValue(null);
  }

  // RETRY CONFIGUARATION CONTROLS

  /** If a user disables retry, clear out previous retry configurations */
  clearControls(): void {
    this.assessmentFormGroup.get('configs.retryConfig.type')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onCount')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onScore.minScore')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onScore.count')?.setValue(null);
  }

  clearScoreRetryControls(): void {
    this.assessmentFormGroup.get('configs.retryConfig.onScore.minScore')?.setValue(null);
    this.assessmentFormGroup.get('configs.retryConfig.onScore.count')?.setValue(null);
  }

  clearDefaultRetry(): void 
  {
    this.assessmentFormGroup.get('configs.retryConfig.onCount')?.setValue(null);
  }


  // Method to handle move on criteria click
  onMoveOnCriteriaClick(value: MoveOnCriteriaTypes)
  {
    if (value === this.moveOnComplete) {
      this.clearMoveOnPassControls();
    } else if (value === this.moveOnPass) {
      this.clearMoveOnCompleteControls();
    }
  }

  // Method to handle retry type click
  onRetryTypeClick(value: RetryType): void {
    if (value === this.retryOnCount) {
      this.clearScoreRetryControls();
    } else if (value === this.scoreRetry) {
      this.clearDefaultRetry();
    }
  }
/** Unsubscribe from all subscriptions */
  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }
}
