import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';


@Injectable({
  providedIn: 'root'
})
export class MicroAppAssessmentQuestionFormService 
{

  constructor(private _fb: FormBuilder)
   {}

  /** A single question form 
   * Options are in array as a question has multiple choices
  */
  createAssessmentQuestionForm(assessmentQuestion?: AssessmentQuestion): FormGroup 
  {
    return this._fb.group({
      id: [assessmentQuestion?.id ?? ""],
      question: [assessmentQuestion?.message ?? ""],
      options: this._fb.array(assessmentQuestion?.options?.map(option => new FormControl(option)) || []),
      selectedOption: [''] //tracking the selected option
    });
  }

  /** Adding all the questions into a form array
   *  Needed for when a content creator chooses a single question mode
   *  We allow for configurations on how questions should appear
   */
  createMicroAppAssessment(assessmentQuestions?: AssessmentQuestion[]): FormArray {
    const questionsArray = assessmentQuestions?.map(question => this.createAssessmentQuestionForm(question)) || [];
    return this._fb.array(questionsArray);
  }

  /** Method to add a new question form to the form array */
  addQuestion(formArray: FormArray, assessmentQuestion?: AssessmentQuestion) {
    formArray.push(this.createAssessmentQuestionForm(assessmentQuestion));
  }

  /** Method to remove a question form from the form array by index */
  removeQuestion(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }
}
