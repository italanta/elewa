import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';


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

  constructor(private questionStore: AssessmentQuestionBankStore) {}

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

  ngOnDestroy(): void {
    this._sBS.unsubscribe()
  }
}
