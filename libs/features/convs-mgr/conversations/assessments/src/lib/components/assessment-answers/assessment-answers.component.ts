import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-answers',
  templateUrl: './assessment-answers.component.html',
  styleUrls: ['./assessment-answers.component.scss'],
})
export class AssessmentAnswersComponent {
  @Input() assessmentMode: number;
  @Input() questionId: string

  @Input() questionFormGroup: FormGroup;

  constructor(private _assessmentForm: AssessmentFormService){}

  get choicesList(){
    return this.questionFormGroup.controls['options'] as FormArray;
  }

  generateAnswerForm(){
    this.choicesList.push(this._assessmentForm.createChoiceForm(this.questionId, this.choicesList));
  }
}
