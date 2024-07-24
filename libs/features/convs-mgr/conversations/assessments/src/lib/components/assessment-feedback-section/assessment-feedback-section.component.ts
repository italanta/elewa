import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
 
import { Assessment, AssessmentOptionValue, AssessmentQuestionOptions, FeedbackCondition, RetryType } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { SetAssessmentScoreService } from '../../services/set-pass-status.service';
import { AssessmentProgress, AssessmentStatusTypes } from '@app/model/convs-mgr/micro-app/assessments';
 
@Component({
  selector: 'app-assessment-feedback-section',
  templateUrl: './assessment-feedback-section.component.html',
  styleUrls: ['./assessment-feedback-section.component.scss'],
})
export class AssessmentFeedbackSectionComponent implements OnInit {
  /** Assessment that's underway */
  @Input() assessment: Assessment;
  /** Assessments form group */
  @Input() assessmentForm: FormGroup;

  @Input() assessmentProgress: AssessmentProgress;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;
  /** Display scores feedback */
  @Input() app: MicroAppStatus;

  allowedAttempts = 0;
  attemptCount: number;

  retryType: RetryType;
  outcome: AssessmentStatusTypes;

  showFeedback = false;
  canRetry: boolean
  marksScored = 0;

  resultsMode = {
    failedAndNoRetries: false,
    failedAndHasRetries: false,
    passedAndHasRetries: false,
    passedAndNoRetries :false,
  }

  constructor(
    private _assessmentScoreService: SetAssessmentScoreService,
    private _assessmentService$: AssessmentService,
    private _router: Router
  ) {}
 
  ngOnInit(): void {
    this.getAllowedAttempts();
    this.setResultMode();
  }

  hasPassed() {
    return (this.outcome == AssessmentStatusTypes.Passed || this.outcome == AssessmentStatusTypes.Completed);
  }

  setResultMode() {
    this.attemptCount = this.assessmentProgress.attemptCount;

    this.retryType = this.assessment?.configs?.retryConfig?.type as RetryType;

    const currentAttempt = this.assessmentProgress.attempts[this.attemptCount];
    this.outcome = currentAttempt.outcome as AssessmentStatusTypes;

    if(this.assessmentForm){
      if(this.retryType === RetryType.onCount){
    
        if(this.attemptCount >= this.allowedAttempts) {
          this.canRetry = false;
        } else {
          this.canRetry = true;
        } 
      
      } else {
        const scoreRetry = this.assessment.configs.retryConfig?.onScore?.minScore as number;

        // If their score is less than the retry config score, then they are allowed to retry
        if(currentAttempt.score < scoreRetry && this.attemptCount < this.allowedAttempts) {
          this.canRetry = true;
          // If their score is less than the retry config score, but they have exhausted the number of retries
        } else if(currentAttempt.score < scoreRetry && this.attemptCount >= this.allowedAttempts) {
          this.canRetry = false;
        } else {
          this.canRetry = false;
        }
      }

      // If they have failed and are out of attempts
      if(this.outcome == AssessmentStatusTypes.Failed && !this.canRetry) {
        this.resultsMode.failedAndNoRetries = true;
        // Show page 8 with only 'Go back to whatsapp' button
      } else if(this.outcome == AssessmentStatusTypes.Failed && this.canRetry) {
        this.resultsMode.failedAndHasRetries = true;
        // Show page 7, with Retry Now & Retry Later Buttons + score(to be designed later)
      }  else if(this.hasPassed() && !this.canRetry) {
        this.resultsMode.passedAndNoRetries = true;
        // Show page 5,
      }  else if(this.hasPassed() && this.canRetry) {
        this.resultsMode.passedAndHasRetries = true;
        // Show page 6, with Retry Now & Retry Later Buttons + score(to be designed later)
      }

      this.handleFeedback();
    }
  }

  getAllowedAttempts() {
    const assessment = {...this.assessment}
    if(this.retryType === RetryType.onCount){
      if(assessment.configs.retryConfig) {
        this.allowedAttempts = assessment.configs.retryConfig.onCount as number;
      }
    } else {
      this.allowedAttempts = assessment?.configs?.retryConfig?.onScore?.count as number;
    }
  }
 
  /**
   * Fetch feedback on whether an answer is wrong or right
   * Update score percentage
   */
  handleFeedback() {
    const maxScore = this.assessment.maxScore;
    const obtainedMarks = this.calculateScore();
    // Score a learner in percentage
    const percentage = Math.round((obtainedMarks / maxScore) * 100);
    console.log(obtainedMarks)
    this.marksScored = percentage
    this._assessmentScoreService.setAssessmentScore(percentage);
    this.showFeedback = true
  }
 
  /** Method to get feedback for a selected option */
  getOptionFeedback(question: AbstractControl): string {
    const selectedOption = question.get('selectedOption')?.value;
    const options = question.get('options')?.value;
    const selectedOptionDetails = options.find((option: { id: string }) => option.id === selectedOption);
 
    return selectedOptionDetails ? selectedOptionDetails.feedback : '';
  }
 
  /** Checking if an answer is right or wrong, to style option accordingly */
  isWrongAnswer(question: AbstractControl, option: AssessmentQuestionOptions): boolean 
  {
    const selectedOption = question.get('selectedOption')?.value;
    if (!selectedOption) {
      return false;
    }
  
    const isSelected = selectedOption === option.id;
    const isAccurate = option.accuracy === 1; 
  
    return isSelected && !isAccurate;
  }

  /** Calculate obtained marks
   *  Get feedback if selected option is correct
   *  Return total scores
   */
  private calculateScore(): number {
    let obtainedMarks = 0;
    for (let i = 0; i < this.assessmentFormArray.length; i++) {
      const question = this.assessmentFormArray.at(i) as FormGroup;
      const selectedOption: string = question.get('selectedOption')?.value;
      const options = question.get('options')?.value;
      const selectedOptionDetails = options.find((option: AssessmentQuestionOptions) => option.id === selectedOption);
  
      if (selectedOptionDetails) {
        this.setFeedback(question, selectedOptionDetails);
  
        if (selectedOptionDetails.accuracy === AssessmentOptionValue.Correct) {  // Only award marks for correct answers
          obtainedMarks += question.get('marks')?.value;
          console.log(obtainedMarks)
        }else if(selectedOptionDetails.accuracy === AssessmentOptionValue.FiftyFifty){
          obtainedMarks += question.get('marks')?.value / 2
        }
      }
    }
    return obtainedMarks;
  }

  private setFeedback(question: FormGroup, selectedOptionDetails: AssessmentQuestionOptions): void {
    const feedback = selectedOptionDetails.feedback;
    const condition = selectedOptionDetails.accuracy === AssessmentOptionValue.Correct ? FeedbackCondition.Correct : FeedbackCondition.Wrong;
    question.get('feedback')?.setValue({ message: feedback, condition: condition });
  }

  retryAssessment() {
    this._router.navigate(['start', this.app.id]);
  }

  backToApp(){
     this._router.navigate(['redirect', this.app.id]);
  }
}
