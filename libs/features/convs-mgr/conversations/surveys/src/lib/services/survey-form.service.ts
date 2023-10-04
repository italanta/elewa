import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Survey, SurveyQuestion, SurveyQuestionOptions, SurveyQuestionType } from '@app/model/convs-mgr/conversations/surveys';

@Injectable({
  providedIn: 'root'
})
export class SurveyFormService {

  constructor(private _formBuilder: FormBuilder) { }

  createSurveyDetailForm(survey: Survey){
    return this._formBuilder.group({
      id: [survey.id ?? ''],
      title: [survey?.title ?? ''],
      questionsOrder: [survey?.questionsOrder ?? []],
      configs: this._formBuilder.group({
        feedback: [survey?.configs?.feedback ?? ''],
        userAttempts: [survey?.configs?.userAttempts ?? '']
      }),
      questions: this._formBuilder.array([])
    });
  }

  createQuestionForm(question?: SurveyQuestion){
    return this._formBuilder.group({
      id: [question?.id ?? ''],
      questionType: SurveyQuestionType.SingleSelectOptions,
      marks: [question?.marks ?? ''],
      message: [question?.message ?? ''],
      options: question?.options ? this._prefillOptions(question?.options) : this._formBuilder.array([
        this.createDefaultChoice()
      ]),
      nextQuestionId: [question?.nextQuestionId ?? null],
      prevQuestionId: [question?.prevQuestionId ?? null],
    });
  }

  createChoiceForm(questionId: string, options: FormArray) {
    return this._formBuilder.group({
      id: [`${questionId} - ${options.length + 1}`],
      text: [''],
      accuracy: [''],
      feedback: ['']
    });
  }

  createDefaultChoice() {
    return this._formBuilder.group({
      id: [`0-1`],
      text: [''],
      accuracy: [''],
      feedback: ['']
    });
  }

  private _prefillOptions(options?: SurveyQuestionOptions[]) {
    const formArray = this._formBuilder.array<FormGroup<any>>([])

    options?.map((option) => {
      const group = this._formBuilder.group({
        id: [option?.id],
        text: [option?.text],
        accuracy: [option?.accuracy],
        feedback: [option?.feedback]
      })

      formArray.push(group);
    })

    return formArray
  }
}
