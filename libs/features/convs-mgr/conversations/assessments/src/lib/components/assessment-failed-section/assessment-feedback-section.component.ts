import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
 
import { Assessment, AssessmentOptionValue, AssessmentQuestionOptions, FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { SetAssessmentScoreService } from '../../services/set-pass-status.service';
 
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
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;
  /** Display scores feedback */
  @Input() app: MicroAppStatus

  showFeedback = false;
  canRetry: boolean
 
  constructor(
    private _assessmentScoreService: SetAssessmentScoreService,
    private _assessmentService$: AssessmentService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    if(this.assessmentForm){
      if(this.assessment?.configs?.userAttempts === 0) this.canRetry = false
      this.handleFeedback();
    }
  }
 
  /**
   * Fetch feedback on whether an answer is wrong or right
   * Update score percentage
   */
  handleFeedback() {
    const totalMarks = this.calculateTotalMarks();
    const obtainedMarks = this.calculateScore();
    // Score a learner in percentage
    const percentage = Math.round((obtainedMarks / totalMarks) * 100);
    this._assessmentScoreService.setAssessmentScore(percentage);
    console.log(percentage)
    if(percentage >= 50) this.showFeedback = true
  }
 
  /** Method to get feedback for a selected option */
  getOptionFeedback(question: AbstractControl): string {
    const selectedOption = question.get('selectedOption')?.value;
    const options = question.get('options')?.value;
    const selectedOptionDetails = options.find((option: { id: string }) => option.id === selectedOption);
 
    return selectedOptionDetails ? selectedOptionDetails.feedback : '';
  }
 
  isWrongAnswer(question: AbstractControl, option: AssessmentQuestionOptions): boolean {
    const selectedOption = question.get('selectedOption')?.value;
    if (!selectedOption) return false;
    return selectedOption.id === option.id && !option.accuracy;
  }

  /** Calcualte the total marks available in an aassessment */
  private calculateTotalMarks(): number
   {
    let totalMarks = 0;
    for (let i = 0; i < this.assessmentFormArray.length; i++) {
      const question = this.assessmentFormArray.at(i) as FormGroup;
      totalMarks += question.get('marks')?.value || 0;
    }
    return totalMarks;
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
    if (this.assessment?.configs?.userAttempts) {
      this.assessment.configs.userAttempts -= 1;
      const updatedConfigs = {
        ...this.assessment.configs,
        userAttempts: this.assessment.configs.userAttempts
      };
      this._assessmentService$.updateAssessment$({
        ...this.assessment,
        configs: updatedConfigs
      });
    }
    this.router.navigate(['start', this.app.appId]);
  }
}
