import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
 
import { Assessment, AssessmentQuestionOptions, RetryType } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentProgress, AssessmentStatusTypes, Attempt } from '@app/model/convs-mgr/micro-app/assessments';
 
@Component({
  selector: 'app-assessment-feedback-section',
  templateUrl: './assessment-feedback-section.component.html',
  styleUrls: ['./assessment-feedback-section.component.scss'],
})
export class AssessmentFeedbackSectionComponent implements OnInit 
{
  /** Assessment that's underway */
  @Input() assessment: Assessment;
  /** Assessments form group */
  @Input() assessmentForm: FormGroup;

  @Input() assessmentProgress: AssessmentProgress;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;
  /** Display scores feedback */
  @Input() app: MicroAppStatus;

  /** Number of times a learner can do an assessment */
  allowedAttempts = 0;
  attemptCount: number;
  /** Conditions for retrial */
  retryType: RetryType;
  /** Final result of an assessment */
  outcome: AssessmentStatusTypes;

  /** Show questions and their answers */
  showFeedback = false;
  /** Track if retry is allowed */
  canRetry: boolean;
  currentProgress: Attempt;
  /** Different statuses to display on the results page (view modes) */
  resultsMode = {
    failedAndNoRetries: false,
    failedAndHasRetries: false,
    passedAndHasRetries: false,
    passedAndNoRetries :false,
  }

  constructor(
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

      this.handleMarksFeedback();
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
  handleMarksFeedback() 
  {
    if(this.assessmentProgress){
      console.log(this.assessmentProgress)
      const currentProgress = this.assessmentProgress.attempts[this.assessmentProgress.attemptCount];
      console.log(this.assessmentProgress.attemptCount)
      console.log(this.currentProgress)
      this.currentProgress = currentProgress as Attempt
      // const questionResponses = currentProgress.questionResponses   
      this.showFeedback = true;
    }
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

  retryAssessment() {
    this._router.navigate(['start', this.app.id]);
  }

  backToApp(){
     this._router.navigate(['redirect', this.app.id]);
  }
}
