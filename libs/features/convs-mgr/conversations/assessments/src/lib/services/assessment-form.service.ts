import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssessmentQuestionType } from '@app/model/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})
export class AssessmentFormService {

  constructor(private _formBuilder: FormBuilder) {}

  createAssessmentDetailForm(){
    return this._formBuilder.group({
      configs: this._formBuilder.group({
        feedback: [''],
        userAttempts: ['']
      }),
      questionForms: this._formBuilder.array([]) 
    });
  }

  createQuestionForm(){
    return this._formBuilder.group({
      questionType: AssessmentQuestionType.SingleSelectOptions,
      marks: [''],
      message: [''],
      feedback: [''],
      answerForms: this._formBuilder.array([])
    });
  }

  createAnswerForm(){
    return this._formBuilder.group({
      text: [''],
      value: ['']
    });
  }

  getFormValues(form: FormGroup){
    return form.value
  }
}
