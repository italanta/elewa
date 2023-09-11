import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';

@Component({
  selector: 'app-assessment-question-forms',
  templateUrl: './assessment-question-forms.component.html',
  styleUrls: ['./assessment-question-forms.component.scss'],
})
export class AssessmentQuestionFormsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() previewMode: boolean;
  @Input() assessmentMode: number;
  @Input() questions: AssessmentQuestion[];

  @Input() assessmentFormGroup: FormGroup;

  count: number;
  formDataIsReady: boolean = false;

  constructor(private _router$$: Router,
              private _assessmentForm: AssessmentFormService
  ) {}

  ngOnInit(): void {}

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
    const lastQstn = this.questionsList.at(this.questionsList.length - 1);
    
    if (lastQstn) {
      this.count = parseInt(lastQstn?.get('id' as string)?.value);
    } else {
      this.count = 0
    }
  }

  addQuestion() {
    const lastQstn = this.questionsList.at(this.questionsList.length - 1);
    const questionForm = this._assessmentForm.createQuestionForm();
    this.count += 1;

    // update nodes
    if (lastQstn) {
      lastQstn.patchValue({ nextQuestionId: `${this.count}` });
      questionForm.patchValue({ prevQuestionId: lastQstn.value.id });
    }

    questionForm.patchValue({ id: `${this.count}` });
    this.questionsList.push(questionForm);
  }

  ngOnDestroy(): void {
    this.questions = [];
    this.questionsList.clear();
  }
}
