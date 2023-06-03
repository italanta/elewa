import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-question-forms',
  templateUrl: './assessment-question-forms.component.html',
  styleUrls: ['./assessment-question-forms.component.scss'],
})
export class AssessmentQuestionFormsComponent implements OnInit {
  @Input() questions: AssessmentQuestion[]
  @Input() assessmentMode: number;

  @Input() assessmentFormGroup: FormGroup;

  constructor(private _assessmentForm: AssessmentFormService){}

  ngOnInit(): void {
    this.getQuestions()
  }

  get questionsList() {
    return this.assessmentFormGroup.get('questions') as FormArray;
  }

  getQuestions() {
    this.questions.map(question => this.questionsList.push(this._assessmentForm.createQuestionForm(question)));
  }

  addQuestion() {
    this.questionsList.push(this._assessmentForm.createQuestionForm())
  }
}
