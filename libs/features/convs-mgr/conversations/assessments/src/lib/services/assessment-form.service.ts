import { Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { AssessmentConfiguration, AssessmentQuestionType } from '@app/model/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})
export class AssessmentFormService {

  constructor(private _formBuilder: FormBuilder) {}

  createAssessmentDetailForm(configs?: AssessmentConfiguration){
    return this._formBuilder.group({
      configs: this._formBuilder.group({
        feedback: [configs?.feedback ?? ''],
        userAttempts: [configs?.userAttempts ?? '']
      }),
      questions: this._formBuilder.array([])
    });
  }

  createQuestionForm(){
    return this._formBuilder.group({
      id: [''],
      questionType: AssessmentQuestionType.SingleSelectOptions,
      marks: [''],
      message: [''],
      feedback: [''],
      options: this._formBuilder.array([])
    });
  }

  createChoiceForm(questionId: string, options: FormArray){
    return this._formBuilder.group({
      id: [`${questionId} - ${options.length + 1}`],
      text: [''],
      value: ['']
    });
  }
}
