import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionComponent } from '../assessment-question/assessment-question.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'convl-italanta-apps-assessment-questions',
  templateUrl: './assessment-questions.component.html',
  styleUrls: ['./assessment-questions.component.scss'],
})
export class AssessmentQuestionsComponent implements OnInit {
  @Input() questions: AssessmentQuestion[]
  @Input() assessmentMode: number;

  questionsForm: FormGroup;

  @ViewChild(AssessmentQuestionComponent) questionComponent: AssessmentQuestionComponent;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup(){
    this.questionsForm = this._formBuilder.group({
      questionForms: this._formBuilder.array([])
    })
  }

  get questionForms(){
    return this.questionsForm.value.questionForms as FormArray;
  }

  get inputQuestions(){
    let questions: AssessmentQuestion[] = [];
    let question: AssessmentQuestion = {} as AssessmentQuestion;

    this.questionForms.controls.map((_formGroup) => {
      question.marks = _formGroup.value.marks;
      question.message = _formGroup.value.message;
      question.options = this.questionComponent.inputAnswers;

      questions.push(question);
    });

    return questions;
  }

  filterQuestions(event: Event){

  }
}
