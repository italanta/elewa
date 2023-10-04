import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SurveyFormService } from '../../services/survey-form.service';

@Component({
  selector: 'app-survey-answers',
  templateUrl: './survey-answers.component.html',
  styleUrls: ['./survey-answers.component.scss'],
})
export class SurveyAnswersComponent implements OnInit{
  @Input() surveyMode: number;
  @Input() questionId: string

  @Input() questionFormGroup: FormGroup;

  constructor(private _router$$: Router,
              private _surveyForm: SurveyFormService
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
      this.choicesList.push(this._surveyForm.createChoiceForm(this.questionId, this.choicesList));
    }
  }

  deleteChoice(i: any) {
    this.choicesList.removeAt(i as number);
  }
}
