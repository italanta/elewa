import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';
import { SubSink } from 'subsink';
import { DeleteQuestionModalComponent } from '../delete-question-modal/delete-question-modal.component';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent implements OnDestroy
{
  @Input() question: AssessmentQuestion;
  private _sBS = new SubSink ();

  constructor (private _questionStore: AssessmentQuestionBankStore,
               private _dialog: MatDialog, 
  ){}

  editQuestion()
  {

  }

  deleteQuestion()
  {
    this._dialog.open(DeleteQuestionModalComponent, 
      {
        data: { question: this.question},
        height: "400px",
        width: "600px"
      }
    )
  }
  ngOnDestroy(): void
  {
   this._sBS.unsubscribe()   
  }
}
