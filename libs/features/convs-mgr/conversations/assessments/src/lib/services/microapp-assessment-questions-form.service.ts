import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { QuestionResponseMap } from '@app/model/convs-mgr/micro-app/assessments';


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
  createAssessmentQuestionForm(assessmentQuestion: AssessmentQuestion, selectedOption?: any): FormGroup 
  {
    return this._fb.group({
      id: [assessmentQuestion?.id ?? ""],
      question: [assessmentQuestion?.message ?? ""],
      options: this._fb.array(assessmentQuestion?.options?.map(option => new FormControl(option)) || []),
      selectedOption: [selectedOption ?? ""], //tracking the selected option
      textAnswer: this._fb.group({
        text: [assessmentQuestion?.textAnswer?.text ?? ""],
        accuracy: [assessmentQuestion?.textAnswer?.accuracy ?? null],
        feedback: [assessmentQuestion?.textAnswer?.feedback ?? ""]
      })
    });
  }

  /** Adding all the questions into a form array
   *  Needed for when a content creator chooses a single question mode
   *  We allow for configurations on how questions should appear
   */
  createMicroAppAssessment(assessmentQuestions?: AssessmentQuestion[], questionResponses?: QuestionResponseMap): FormArray 
  {
    const questionsArray = assessmentQuestions?.map(question => {
      let selectedOption;
      const id = question.id as string;

      if(questionResponses && questionResponses[id]) {
        selectedOption = {
          id: questionResponses[id].answerId,
          text: questionResponses[id].answerText,
        }
      }

      return this.createAssessmentQuestionForm(question, selectedOption);
    }) || [];
    return this._fb.array(questionsArray);
  }

  /** Method to add a new question form to the form array */
  addQuestion(formArray: FormArray, assessmentQuestion?: AssessmentQuestion) 
  {
    formArray.push(this.createAssessmentQuestionForm(assessmentQuestion as AssessmentQuestion));
  }

  /** Method to remove a question form from the form array by index */
  removeQuestion(formArray: FormArray, index: number)
  {
    formArray.removeAt(index);
  }
}
