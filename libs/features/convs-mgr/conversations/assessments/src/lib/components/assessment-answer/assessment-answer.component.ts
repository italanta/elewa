import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'convl-italanta-apps-assessment-answer',
  templateUrl: './assessment-answer.component.html',
  styleUrls: ['./assessment-answer.component.scss'],
})
export class AssessmentAnswerComponent implements OnInit {
  @Input() answer: AssessmentQuestionOptions = {} as AssessmentQuestionOptions;
  @Input() assessmentMode: number;

  answerForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.createFormGroup();

    if(!this.assessmentMode){
      this.updateFormGroup();
    }
  }

  createFormGroup(){
    this.answerForm = this._formBuilder.group({
      answerText: [''],
      answerValue: ['']
    });
  }

  updateFormGroup(){
    this.answerForm.patchValue({
      text: this.answer.text,
      value: this.answer.value 
    })
  }
}
