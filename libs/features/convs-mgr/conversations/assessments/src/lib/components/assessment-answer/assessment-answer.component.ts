import { Component, Input } from '@angular/core';
import {  FormArray, FormGroup } from '@angular/forms';

import { AssessmentOptionValue, AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-answer',
  templateUrl: './assessment-answer.component.html',
  styleUrls: ['./assessment-answer.component.scss'],
})
export class AssessmentAnswerComponent  {
  @Input() answer: AssessmentQuestionOptions = {} as AssessmentQuestionOptions;
  @Input() assessmentMode: number;

  @Input() questionFormGroup: FormGroup;
  @Input() answerFormGroupName: number | string;

  correct = AssessmentOptionValue.Correct;
  wrong = AssessmentOptionValue.Wrong;
  fiftyFifty = AssessmentOptionValue.FiftyFifty;

  get answerFormGroup(){
    const answerForms = this.questionFormGroup.get('choicesList') as FormArray;
    return answerForms.controls[this.answerFormGroupName as number] as FormGroup;
  }
}
