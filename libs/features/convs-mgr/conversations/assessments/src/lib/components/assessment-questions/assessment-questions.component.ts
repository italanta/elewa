import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs';
import { SubSink } from 'subsink';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentQuestionComponent } from '../assessment-question/assessment-question.component';


@Component({
  selector: 'convl-italanta-apps-assessment-questions',
  templateUrl: './assessment-questions.component.html',
  styleUrls: ['./assessment-questions.component.scss'],
})
export class AssessmentQuestionsComponent implements OnInit, OnDestroy {
  @Input() questions: AssessmentQuestion[]
  @Input() assessmentMode: number;

  questionsForm: FormGroup;
  questionNo = 1;

  @ViewChild('addQuestions', { read: ViewContainerRef }) addQuestions: ViewContainerRef;

  private _sbS = new SubSink();

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.createFormGroup();
  }

  get questionForms(){
    return this.questionsForm.value.questionForms as FormArray;
  }

  get inputQuestions(){
    return this.questionForms
  }

  createFormGroup(){
    this.questionsForm = this._formBuilder.group({
      questionForms: this._formBuilder.array([])
    })
  }

  generateQuestionForm(){
    const component = this.addQuestions.createComponent(AssessmentQuestionComponent);
    component.instance.assessmentMode = 1;
    component.instance.questionNo = this.questionNo++;
    // Populate questions form array with question form group after component is created
    this._sbS.sink = component.instance.created.pipe(tap((_event) => {
      this.questionForms.push(component.instance.questionForm);
      console.log(this.questionForms);
    })).subscribe();
    
  }


  filterQuestions(event: Event){

  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
