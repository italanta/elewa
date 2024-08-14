import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-delete-question-modal',
  templateUrl: './delete-question-modal.component.html',
  styleUrl: './delete-question-modal.component.scss',
})
export class DeleteQuestionModalComponent implements OnDestroy
{
  question: AssessmentQuestion;

  private _sBS = new SubSink();

  constructor ( private _questionStore: AssessmentQuestionBankStore,
                private _dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: { question : AssessmentQuestion }
  ){ this.question = data.question}

  deleteQuestion ()
  {
    this._sBS.sink = this._questionStore.remove(this.question).subscribe(() => this._dialog.closeAll());
  }

  closeDialog(){
    this._dialog.closeAll()
  }

  ngOnDestroy(): void {
    this._sBS.unsubscribe()
  }
}
