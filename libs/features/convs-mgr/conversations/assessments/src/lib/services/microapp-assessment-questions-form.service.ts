import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { AssessmentFeedBack, AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppAssessmentQuestion } from '@app/model/convs-mgr/micro-app/base';


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
  createAssessmentQuestionForm(assessmentQuestion?: MicroAppAssessmentQuestion): FormGroup 
  {
    return this._fb.group({
        id: [assessmentQuestion?.id ?? ""],
        questionType: [assessmentQuestion?.questionType ?? null],
        marks: [assessmentQuestion?.marks ?? 0],
        message: [assessmentQuestion?.message ?? 0],
        feedback: this.createFeedbackFormGroup(assessmentQuestion?.feedback),
        options: new FormArray(this.createOptionsFormArray(assessmentQuestion?.options)),
        prevQuestionId: [assessmentQuestion?.prevQuestionId ?? ""],
        nextQuestionId: [assessmentQuestion?.nextQuestionId ?? ""],
        selectedOption: [''] // tracking the selected option
    });
  }

  createFeedbackFormGroup(feedback?: AssessmentFeedBack): FormGroup {
      return this._fb.group({
          message: [feedback?.message ?? ""],
          condition: [feedback?.condition ?? null]
      });
  }

  createOptionsFormArray(options?: AssessmentQuestionOptions[]): AbstractControl[] {
      if (!options || options.length === 0) {
          return [];
      }

      return options.map(option =>
          this._fb.group({
              id: [option.id],
              text: [option.text],
              accuracy: [option.accuracy],
              feedback: [option.feedback]
          })
      );
  }

  /** Adding all the questions into a form array
   *  Needed for when a content creator chooses a single question mode
   *  We allow for configurations on how questions should appear
   */
  createMicroAppAssessment(assessmentQuestions?: MicroAppAssessmentQuestion[]): FormArray {
    const questionsArray = assessmentQuestions?.map(question => this.createAssessmentQuestionForm(question)) || [];
    return this._fb.array(questionsArray);
  }

  /** Method to add a new question form to the form array */
  addQuestion(formArray: FormArray, assessmentQuestion?: MicroAppAssessmentQuestion) {
    formArray.push(this.createAssessmentQuestionForm(assessmentQuestion));
  }

  /** Method to remove a question form from the form array by index */
  removeQuestion(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }
}
