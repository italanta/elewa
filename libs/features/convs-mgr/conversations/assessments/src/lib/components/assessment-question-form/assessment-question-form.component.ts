import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { Observable, tap } from 'rxjs';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { FeedbackCondition } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';

@Component({
  selector: 'app-assessment-question-form',
  templateUrl: './assessment-question-form.component.html',
  styleUrls: ['./assessment-question-form.component.scss'],
})
export class AssessmentQuestionFormComponent implements OnInit, OnDestroy {

  private _sBs = new SubSink();

  @Input() questions: AssessmentQuestion[];
  @Input() questionNo: number;
  @Input() isLastQuestion: boolean;

  @Input() index: number;

  @Input() assessmentMode: number;
  
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;
  @Input() activeCard$: Observable<number>;

  @Output() addNewQuestion = new EventEmitter<FormGroup>();
  @Output() activeQuestionChanged = new EventEmitter();
  
  activeCard: number;

  constructor(
    private _assessmentForm: AssessmentFormService
  ) {}

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
    return this.assessmentFormGroup.get('questions') as FormArray;
  }

  get questionFormGroup(){
    return this.questionsList.controls[this.questionFormGroupName as number] as FormGroup;
  }

  /** delete Question */
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

  /** duplicate question */
  duplicateQuestion() {
    const prevQuestion = this.questionsList.at(this.index) as FormGroup;

    const copiedQstn = this._assessmentForm.createQuestionForm(prevQuestion.value);
  
    copiedQstn.patchValue({ nextQuestionId : null });
  
    this.addNewQuestion.emit(copiedQstn);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
