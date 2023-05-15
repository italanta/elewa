import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { AssessmentQuestion, AssessmentQuestionType } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentAnswerComponent } from '../assessment-answer/assessment-answer.component';
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

  @ViewChild(AssessmentAnswersComponent) answersComponent: AssessmentAnswersComponent;
  
  questionForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(){
    this.createFormGroup(); 

    if(!this.assessmentMode){
      this.updateFormGroup();
    }
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

  get inputAnswers(){ 
    return this.answersComponent.inputAnswers 
  }
}
