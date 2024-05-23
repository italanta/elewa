import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AssessmentQuestion } from '../models/assessment-question.interface';

@Injectable({
  providedIn: 'root'
})
export class MicroAppAssessmentQuestionFormService {

  constructor(private _fb: FormBuilder) {}

  /** A single question form */
  createAssessmentQuestionForm(assessmentQuestion?: AssessmentQuestion): FormGroup {
    return this._fb.group({
      id: [assessmentQuestion?.id ?? ""],
      question: [assessmentQuestion?.question ?? ""],
      options: this._fb.array(assessmentQuestion?.options.map(option => new FormControl(option)) || []),
      selectedOption: [''] //tracking the selected option
    });
  }

  /** Adding all the questions into a form array */
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
