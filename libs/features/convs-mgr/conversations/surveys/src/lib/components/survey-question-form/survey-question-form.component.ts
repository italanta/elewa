import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable, tap } from 'rxjs';

import { FeedbackCondition, SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';

@Component({
  selector: 'app-survey-question-form',
  templateUrl: './survey-question-form.component.html',
  styleUrls: ['./survey-question-form.component.scss'],
})
export class SurveyQuestionFormComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  @Input() questions: SurveyQuestion[];
  @Input() questionNo: number;
  @Input() isLastQuestion: boolean;

  @Input() index: number;

  @Input() surveyMode: number;
  
  @Input() surveyFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;
  @Input() activeCard$: Observable<number>;

  @Output() addNewQuestion = new EventEmitter();
  @Output() activeQuestionChanged = new EventEmitter();
  
  activeCard: number;

  constructor() {}

  feedBackConditions = [
    FeedbackCondition[1],
    FeedbackCondition[2],
    FeedbackCondition[3],
  ];

  ngOnInit(): void {
    this.activeCard$.pipe(tap((activeId) => {
      this.activeCard = activeId;
    })).subscribe();
  }

  get questionsList() {
    return this.surveyFormGroup.get('questions') as FormArray;
  }

  get questionFormGroup(){
    return this.questionsList.controls[this.questionFormGroupName as number] as FormGroup;
  }

  deleteQuestion() {
    const question = this.questionsList.at(this.index);
    const prevQuestion = this.questionsList.at(this.index - 1);
    const nextQuestion = this.questionsList.at(this.index + 1);

    if (prevQuestion) {
      prevQuestion.patchValue({ nextQuestionId : question.value.nextQuestionId })
    };

    if (nextQuestion) {
      nextQuestion.patchValue({ prevQuestionId : question.value.prevQuestionId })
    };

    this.questionsList.removeAt(this.index);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
