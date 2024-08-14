import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from 'libs/features/convs-mgr/conversations/assessments/src/lib/services/assessment-form.service';

@Component({
  selector: 'lib-question-bank-list-component',
  templateUrl: './question-bank-list.component.html',
  styleUrl: './question-bank-list.component.scss'
})
export class QuestionBankListComponent implements OnInit
{
  i: number;
  count = 0;

  questionsFormArray: FormArray;

  constructor(private fb: FormBuilder, private _assessmentForm: AssessmentFormService) {}

  ngOnInit(): void {
    this.questionsFormArray = this.fb.array([]);
  }

  addNewQuestion(newQForm?: FormGroup) {
    const questionForm = newQForm ? newQForm : this._assessmentForm.createQuestionForm();
    this.questionsFormArray.push(questionForm);
  }

  get questions() {
    return this.questionsFormArray;
  }

}
