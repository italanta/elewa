import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';

import { SurveyFormService } from '../../services/survey-form.service';

@Component({
  selector: 'app-survey-question-forms',
  templateUrl: './survey-question-forms.component.html',
  styleUrls: ['./survey-question-forms.component.scss'],
})
export class SurveyQuestionFormsComponent implements AfterViewInit, OnDestroy, OnInit{
  @Input() previewMode: boolean;
  @Input() surveyMode: number;
  @Input() questions: SurveyQuestion[];

  @Input() surveyFormGroup: FormGroup;

  count: number = 0;
  formDataIsReady = false;

  activeCard$ = new Subject<number>();

  constructor(private _router$$: Router,
              private _surveyForm: SurveyFormService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const action = this._router$$.url.split('/')[2];

    if (action === 'create') {
      if (!this.previewMode) {
        const questionForm = this._surveyForm.createQuestionForm();
        questionForm.patchValue({ id: `0` });
        this.questionsList.push(questionForm);
        this.count++;
        this.formDataIsReady = true;
      }
    } else {
      if (this.questions) {
        this.questions.map(question => this.questionsList.push(this._surveyForm.createQuestionForm(question)));
        this.getCount();
        this.formDataIsReady = true;
      }
    }
  }

  get questionsList() {
    return this.surveyFormGroup.get('questions') as FormArray;
  }

  getCount() {
    const lastQstn = this.questionsList.at(this.questionsList.length - 1);
    
    if (lastQstn) {
      this.count = parseInt(lastQstn?.get('id' as string)?.value);
    } else {
      this.count = 0
    }
  }

  addQuestion() {
    const lastQstn = this.questionsList.at(this.questionsList.length - 1);
    const questionForm = this._surveyForm.createQuestionForm();
    this.count += 1;

    // update nodes
    if (lastQstn) {
      lastQstn.patchValue({ nextQuestionId: `${this.count}` });
      questionForm.patchValue({ prevQuestionId: lastQstn.value.id });
    }

    questionForm.patchValue({ id: `${this.count}` });
    this.questionsList.push(questionForm);
  }

  drop(event: any) {
    moveItemInArray(this.questionsList.controls, event.previousIndex, event.currentIndex);

    let newFormOrder = this.surveyFormGroup.value.questions;
    let movedQuestion = newFormOrder[event.currentIndex];
    newFormOrder[event.currentIndex] = newFormOrder[event.previousIndex];
    newFormOrder[event.previousIndex] = movedQuestion;

    this.surveyFormGroup.value.questions = newFormOrder;
  }

  activeQuestionChanged(index: number) {
    this.activeCard$.next(index);
  }

  ngOnDestroy(): void {
    this.questions = [];
    this.questionsList.clear();
  }
}
