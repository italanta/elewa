import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-question-form',
  templateUrl: './assessment-question-form.component.html',
  styleUrls: ['./assessment-question-form.component.scss'],
})
export class AssessmentQuestionFormComponent implements OnInit, OnDestroy {

  @Input() questions: AssessmentQuestion[];
  @Input() questionNo: number;
  @Input() isLastQuestion: boolean;

  @Input() index: number;

  @Input() assessmentMode: number;
  
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;

  @Output() addNewQuestion = new EventEmitter();
  
  private _sBs = new SubSink();

  constructor() {}

  feedBackConditions = [
    FeedbackCondition[1],
    FeedbackCondition[2],
    FeedbackCondition[3],
  ];

  ngOnInit(): void {
    let x = this.assessmentFormGroup
    debugger
  }

  get questionsList() {
    return this.assessmentFormGroup.get('questions') as FormArray;
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
