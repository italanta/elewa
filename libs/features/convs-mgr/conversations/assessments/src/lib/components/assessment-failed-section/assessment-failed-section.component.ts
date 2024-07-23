import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { SetAssessmentScoreService } from '../../services/set-pass-status.service';
import { Router } from '@angular/router';
 
import { Assessment, AssessmentQuestionOptions, FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';
 
@Component({
  selector: 'app-assessment-failed-section',
  templateUrl: './assessment-failed-section.component.html',
  styleUrls: ['./assessment-failed-section.component.scss'],
})
export class AssessmentFailedSectionComponent implements OnInit {
  /** Assessment that's underway */
  @Input() assessment: Assessment;
  /** Assessments form group */
  @Input() assessmentForm: FormGroup;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;
  /** Display scores feedback */
  showFeedback = false;
 
  constructor(
    private _assessmentScoreService: SetAssessmentScoreService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    if(this.assessmentForm){
      this.handleFeedback();
      console.log(this.assessmentFormArray.value)
    }
  }
 
  /**
   * Fetch feedback on whether an answer is wrong or right
   * Update score percentage
   */
  handleFeedback() {
    this.showFeedback = true;
    let totalMarks = 0;
    let obtainedMarks = 0;
    // Calculate the total marks available
    for (let i = 0; i < this.assessmentFormArray.length; i++) {
      const question = this.assessmentFormArray.at(i) as FormGroup;
      totalMarks += question.get('marks')?.value || 0;
    }
 
    // Iterate through the controls of assessmentFormArray to Fetch a single question form group
    for (let i = 0; i < this.assessmentFormArray.length; i++) {
      const question = this.assessmentFormArray.at(i) as FormGroup;
      // Fetch an option that has been picked as the answer, then compare the id of the selected option to the available options
      const selectedOption: AssessmentQuestionOptions = question.get('selectedOption')?.value;
      const selectedOptionId = selectedOption?.id;
      const options = question.get('options')?.value;
      const selectedOptionDetails = options.find((option: AssessmentQuestionOptions) => option.id === selectedOptionId);
      // Give feedback provided for the particular option
      if (selectedOptionDetails) {
        const feedback = selectedOption.accuracy ? selectedOption.feedback : selectedOption.feedback;
        const condition = selectedOption.accuracy ? FeedbackCondition.Correct : FeedbackCondition.Wrong;
        question.get('feedback')?.setValue({ message: feedback, condition: condition });
 
        // Calculating marks
        if (selectedOptionDetails.accuracy) {
          obtainedMarks += question.get('marks')?.value || 0;
        }
      }
    }
    // Calculate percentage and save it to score service
    const percentage = (obtainedMarks / totalMarks) * 100;
    this._assessmentScoreService.setAssessmentScore(percentage);
  }
 
  /** Method to get feedback for a selected option */
  getOptionFeedback(question: AbstractControl): string {
    const selectedOption = question.get('selectedOption')?.value;
    const options = question.get('options')?.value;
    const selectedOptionDetails = options.find((option: { id: string }) => option.id === selectedOption?.id);
 
    return selectedOptionDetails ? selectedOptionDetails.feedback : '';
  }
 
  retryAssessment() {
    this.router.navigate(['start']);
    if (this.assessment?.configs?.userAttempts) {
      this.assessment.configs.userAttempts -= 1;
    }
    // TODO: Update actual assessment to reduce retries
  }
 
  isWrongAnswer(question: AbstractControl, option: AssessmentQuestionOptions): boolean {
    const selectedOption = question.get('selectedOption')?.value;
    if (!selectedOption) return false;
    return selectedOption.id === option.id && !option.accuracy;
  }
}
