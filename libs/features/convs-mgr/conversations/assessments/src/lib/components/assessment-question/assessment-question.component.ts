import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AssessmentQuestion, AssessmentQuestionType } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentAnswersComponent } from '../assessment-answers/assessment-answers.component';

@Component({
  selector: 'convl-italanta-apps-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.scss'],
})
export class AssessmentQuestionComponent implements OnInit {
  @Input() question: AssessmentQuestion = {} as AssessmentQuestion;
  @Input() questionNo: number;

  @Input() assessmentMode: number;
  @Output() created: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(AssessmentAnswersComponent) answersComponent: AssessmentAnswersComponent;
  
  questionForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(){
    this.createFormGroup(); 
    // Notify component creation after initialization of form group
    this.notifyCreationEvent();

    if(!this.assessmentMode){
      this.updateFormGroup();
    }
  }

  get inputQuestion(){
    return this.questionForm.value;
  }

  notifyCreationEvent(){
    this.created.emit();
  }

  createFormGroup(){
    this.questionForm = this._formBuilder.group({
      questionType: AssessmentQuestionType.SingleSelectOptions,
      message: [''],
      marks: [''],
      feedback: [''],
      options: this._formBuilder.array([])
    });
  }


  updateFormGroup(){
    this.questionForm.patchValue({
      marks: this.question.marks,
    });
  }


}
