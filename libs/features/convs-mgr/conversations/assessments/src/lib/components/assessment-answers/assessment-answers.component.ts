import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-answers',
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

  get choicesList(){
    return this.questionFormGroup.controls['choicesList'] as FormArray;
  }

  generateAnswerForm(){
    this.choicesList.push(this._assessmentForm.createAnswerForm());
  }

}
