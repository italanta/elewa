import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { Subject } from 'rxjs';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';

@Component({
  selector: 'app-assessment-question-forms',
  templateUrl: './assessment-question-forms.component.html',
  styleUrls: ['./assessment-question-forms.component.scss'],
})
export class AssessmentQuestionFormsComponent implements AfterViewInit, OnDestroy {

  @Input() previewMode: boolean;
  @Input() assessmentMode: number;
  @Input() questions: AssessmentQuestion[];

  @Input() assessmentFormGroup: FormGroup;

  count = 0;
  formDataIsReady = false;

  activeCard$ = new Subject<number>();

  constructor(private _router$$: Router,
              private _assessmentForm: AssessmentFormService
  ) {}

  ngAfterViewInit(): void {
    const action = this._router$$.url.split('/')[2];

    if (action === 'create') {
      if (!this.previewMode) {
        const questionForm = this._assessmentForm.createQuestionForm();
        questionForm.patchValue({ id: `0` });
        this.questionsList.push(questionForm);
        this.count++;
        this.formDataIsReady = true;
      }
    } else {
      if (this.questions) {
        this.questions.map(question => this.questionsList.push(this._assessmentForm.createQuestionForm(question)));
        this.getCount();
        this.formDataIsReady = true;
      }
    }
  }

  get questionsList() {
    return this.assessmentFormGroup.get('questions') as FormArray;
  }

  getCount() {
    this.count = this.questionsList.length - 1;
  }

  addQuestion(newQForm?: FormGroup) {

    const lastQstn = this.questionsList.at(this.questionsList.length - 1);

    const questionForm =  newQForm ? newQForm : this._assessmentForm.createQuestionForm();

    this.count += 1;

    // update nodes
    if (lastQstn) {
      lastQstn.patchValue({ nextQuestionId: `${this.count}` });
      questionForm.patchValue({ prevQuestionId: lastQstn.value.id });
    }

    if (newQForm) {
      questionForm.patchValue({ id:`${this.count}`, message:`${questionForm.value.message} - Copy`});
    } else {
      questionForm.patchValue({ id:`${this.count}`});
    } 

    this.questionsList.push(questionForm);
  }

  activeQuestionChanged(index: number) {
    this.activeCard$.next(index);
  }

  drop(event: any) {
    moveItemInArray(this.questionsList.controls, event.previousIndex, event.currentIndex);

    const newFormOrder = this.assessmentFormGroup.value.questions;
    const movedQuestion = newFormOrder[event.currentIndex];
    newFormOrder[event.currentIndex] = newFormOrder[event.previousIndex];
    newFormOrder[event.previousIndex] = movedQuestion;

    this.assessmentFormGroup.value.questions = newFormOrder;
  }

  ngOnDestroy(): void {
    this.questions = [];
    this.questionsList.clear();
  }
}
