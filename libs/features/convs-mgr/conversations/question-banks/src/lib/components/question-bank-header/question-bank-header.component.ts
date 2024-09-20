import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AssessmentFormService } from '@app/features/convs-mgr/conversations/assessments';
import { QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';



@Component({
  selector: 'lib-question-bank-header',
  templateUrl: './question-bank-header.component.html',
  styleUrl: './question-bank-header.component.scss',
})
export class QuestionBankHeaderComponent 
{
  questionsFormGroup: FormGroup;
  addAQuestion: boolean;
  formViewMode: QuestionFormMode
  @Output() viewMode = new EventEmitter<QuestionFormMode>();
  @Output() addNewQuestion = new EventEmitter<FormGroup>();
  @Output() addMode = new EventEmitter<boolean>();

  constructor(private _assessmentForm: AssessmentFormService) {}

  /** Triggering form output */
  addQuestion() 
  {
    this.addAQuestion = true;
    this.questionsFormGroup = this._assessmentForm.createQuestionForm();
    this.formViewMode = QuestionFormMode.QuestionBankMode

    this.addNewQuestion.emit(this.questionsFormGroup);
    this.addMode.emit(this.addAQuestion);
    this.viewMode.emit(this.formViewMode)
  }

}
