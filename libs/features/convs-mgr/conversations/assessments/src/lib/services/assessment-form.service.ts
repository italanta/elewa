import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

import { 
  AssessmentConfiguration, 
  AssessmentQuestion, 
  AssessmentQuestionOptions, 
  AssessmentQuestionType 
} from '@app/model/convs-mgr/conversations/assessments';

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

  createQuestionForm(question?: AssessmentQuestion){
    return this._formBuilder.group({
      id: [question?.id ?? ''],
      questionType: AssessmentQuestionType.SingleSelectOptions,
      marks: [question?.marks ?? ''],
      message: [question?.message ?? ''],
      feedback: [question?.feedback ?? ''],
      options: question?.options ? this._prefillOptions(question?.options) : this._formBuilder.array([])
    });
  }

  createChoiceForm(questionId: string, options: FormArray) {
    return this._formBuilder.group({
      id: [`${questionId} - ${options.length + 1}`],
      text: [''],
      value: ['']
    });
  }

  private _prefillOptions(options?: AssessmentQuestionOptions[]) {
    const formArray = this._formBuilder.array<FormGroup<any>>([])

    options?.map((option) => {
      const group = this._formBuilder.group({
        id: [option?.id],
        text: [option?.text],
        value: [option?.value]
      })

      formArray.push(group);
    })

    return formArray
  }
}
