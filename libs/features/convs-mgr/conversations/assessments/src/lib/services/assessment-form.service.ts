import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

import { Assessment, AssessmentConfiguration, AssessmentQuestion, AssessmentQuestionOptions, 
  AssessmentQuestionType } from '@app/model/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})

export class AssessmentFormService {

  constructor(private _formBuilder: FormBuilder) {}

  createAssessmentDetailForm(assessment: Assessment){
    return this._formBuilder.group({
      id: [assessment.id ?? ''],
      title: [assessment?.title ?? ''],
      questionsOrder: [assessment?.questionsOrder ?? []],
      configs: this._formBuilder.group({
        feedback: [assessment!.configs?.feedback ?? ''],
        userAttempts: [assessment!.configs?.userAttempts ?? '']
      }),
      questions: this._formBuilder.array([])
    });
  }

  createQuestionForm(question?: AssessmentQuestion){
    return this._formBuilder.group({
      id: [question?.id ?? ''],
      questionType: AssessmentQuestionType.SingleSelectOptions,
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

  private _prefillOptions(options?: AssessmentQuestionOptions[]) {
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
