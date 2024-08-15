import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionToAssessmentComponent } from '../add-question-to-assessment/add-question-to-assessment.component';


@Component({
  selector: 'lib-question-bank-list-component',
  templateUrl: './question-bank-list.component.html',
  styleUrl: './question-bank-list.component.scss'
})
export class QuestionBankListComponent implements OnInit, OnDestroy
{
  questionsFormGroup: FormGroup;
  isAddingQuestion = false;
  questions: AssessmentQuestion[] = []

  private _sBS = new SubSink ()

  constructor(private questionStore: AssessmentQuestionBankStore,
              private _dialog: MatDialog,
  ) {}

  ngOnInit()
  {
    this._sBS.sink = this.questionStore.get().subscribe(_res => this.questions = _res)
  }

  /** Sending form group to event */
  onNewQuestionAdded(questionFormGroup: FormGroup)
   {
    this.questionsFormGroup = questionFormGroup;
  }

  /** Listening to add clicked */
  onAddModeChanged(addMode: boolean)
  {
    this.isAddingQuestion = addMode;
  }

  addQuestion(id: string)
  {
    this._dialog.open(AddQuestionToAssessmentComponent, 
      {
        data: {question: this.questions.filter((question)=> question.id === id)},
        panelClass: "__addModal"
      }
    )
  }

  ngOnDestroy(): void {
    this._sBS.unsubscribe()
  }
}
