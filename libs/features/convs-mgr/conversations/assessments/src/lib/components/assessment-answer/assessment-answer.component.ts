import { Component, Input, OnInit } from '@angular/core';
import {  FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'convl-italanta-apps-assessment-answer',
  templateUrl: './assessment-answer.component.html',
  styleUrls: ['./assessment-answer.component.scss'],
})
export class AssessmentAnswerComponent implements OnInit {
  @Input() answer: AssessmentQuestionOptions = {} as AssessmentQuestionOptions;
  @Input() assessmentMode: number;

  @Input() questionFormGroup: FormGroup;
  @Input() answerFormGroupName: number | string;

  constructor(){}

  ngOnInit(): void {}

  get answerFormGroup(){
    let answerForms = this.questionFormGroup.get('answerForms') as FormArray;
    return answerForms.controls[this.answerFormGroupName as number] as FormGroup;
  }
}
