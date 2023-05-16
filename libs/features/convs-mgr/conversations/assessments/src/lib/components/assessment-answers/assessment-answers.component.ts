import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentAnswerComponent } from '../assessment-answer/assessment-answer.component';

@Component({
  selector: 'convl-italanta-apps-assessment-answers',
  templateUrl: './assessment-answers.component.html',
  styleUrls: ['./assessment-answers.component.scss'],
})
export class AssessmentAnswersComponent implements OnInit {
  @Input() answers?: AssessmentQuestionOptions[] = [] as AssessmentQuestionOptions[];
  @Input() assessmentMode: number;

  @ViewChild(AssessmentAnswerComponent) answerComponent: AssessmentAnswerComponent;

  answersForm: FormGroup;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.createFormGroup();

    if(!this.assessmentMode){
      this.updateFormGroup();
    }
  }

  createFormGroup(){
    this.answersForm = this._formBuilder.group({
      answerForms: this._formBuilder.array([])
    });
  }

  updateFormGroup(){
    // Update form group values
  }

  get answerForms(){
    return this.answersForm.value.answerForms as FormArray;
  }

  get inputAnswers(){
    let answers: AssessmentQuestionOptions[] = [];
    let answer: AssessmentQuestionOptions = {} as AssessmentQuestionOptions;

    this.answerForms.controls.map((_formGroup) => {
      answer.text = _formGroup.value.answerText;
      answer.value = _formGroup.value.answerValue;
      answers.push(answer);
    })

    return answers;
  }
}
