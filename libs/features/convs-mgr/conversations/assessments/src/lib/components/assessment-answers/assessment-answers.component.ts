import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-answers',
  templateUrl: './assessment-answers.component.html',
  styleUrls: ['./assessment-answers.component.scss'],
})
export class AssessmentAnswersComponent implements OnInit {
  @Input() assessmentMode: number;
  @Input() questionId: string

  @Input() questionFormGroup: FormGroup;

  constructor(private _router$$: Router,
              private _assessmentForm: AssessmentFormService
  ){}

  ngOnInit(): void {
    const action = this._router$$.url.split('/')[2];

    if (action === 'create') {
      this.generateAnswerForm(0);
    }
  }

  get choicesList(){
    return this.questionFormGroup.controls['options'] as FormArray;
  }

  generateAnswerForm(index: number) {
    const totalAnswers = this.choicesList.controls.length;    
    if (index == totalAnswers - 1 || totalAnswers == 0) {
      this.choicesList.push(this._assessmentForm.createChoiceForm(this.questionId, this.choicesList));
    }
  }

  deleteChoice(i: any) {
    this.choicesList.removeAt(i as number);
  }
}
