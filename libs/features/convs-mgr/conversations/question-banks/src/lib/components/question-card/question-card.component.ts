import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';
import { AssessmentFormService } from '@app/features/convs-mgr/conversations/assessments';

import { DeleteQuestionModalComponent } from '../delete-question-modal/delete-question-modal.component';


@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent implements OnDestroy
{
  @Input() question: AssessmentQuestion;
  questionsFormGroup: FormGroup;
  addAQuestion: boolean;

  @Output() addNewQuestion = new EventEmitter<FormGroup>();
  @Output() addMode = new EventEmitter<boolean>();
  private _sBS = new SubSink ();

  constructor (private _questionStore: AssessmentQuestionBankStore,
               private _dialog: MatDialog, 
               private _assessmentForm: AssessmentFormService
  ){}

  editQuestion()
  {
    this.addAQuestion = true;
    this.questionsFormGroup = this._assessmentForm.createQuestionForm(this.question);

    this.addNewQuestion.emit(this.questionsFormGroup);
    this.addMode.emit(this.addAQuestion);
  }

  deleteQuestion()
  {
    this._dialog.open(DeleteQuestionModalComponent, 
      {
        data: { question: this.question},
        height: "300px",
        width: "600px"
      }
    )
  }
  ngOnDestroy(): void
  {
   this._sBS.unsubscribe()   
  }
}
