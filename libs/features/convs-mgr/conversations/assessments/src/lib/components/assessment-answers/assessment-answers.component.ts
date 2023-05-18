import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'convl-italanta-apps-assessment-answers',
  templateUrl: './assessment-answers.component.html',
  styleUrls: ['./assessment-answers.component.scss'],
})
export class AssessmentAnswersComponent implements OnInit {
  @Input() answers?: AssessmentQuestionOptions[] = [] as AssessmentQuestionOptions[];
  @Input() assessmentMode: number;

  @Input() questionFormGroup: FormGroup;

  constructor(private _assessmentForm: AssessmentFormService){}

  ngOnInit(): void {
    this.generateAnswerForm();
  }

  get answerForms(){
    return this.questionFormGroup.controls['answerForms'] as FormArray;
  }

  generateAnswerForm(){
    this.answerForms.push(this._assessmentForm.createAnswerForm());
  }

}
