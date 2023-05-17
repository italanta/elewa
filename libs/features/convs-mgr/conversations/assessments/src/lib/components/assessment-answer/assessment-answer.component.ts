import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() created: EventEmitter<boolean> = new EventEmitter<boolean>();

  answerForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.createFormGroup();
    // Notify parent of component creation after initialization of form group
    this.notifyCreationEvent();

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
    });
  }

  notifyCreationEvent(){
    this.created.emit(true);
  }
}
