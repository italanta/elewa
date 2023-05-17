import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { tap } from 'rxjs';

import { AssessmentQuestionOptions } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentAnswerComponent } from '../assessment-answer/assessment-answer.component';


@Component({
  selector: 'convl-italanta-apps-assessment-answers',
  templateUrl: './assessment-answers.component.html',
  styleUrls: ['./assessment-answers.component.scss'],
})
export class AssessmentAnswersComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() answers?: AssessmentQuestionOptions[] = [] as AssessmentQuestionOptions[];
  @Input() assessmentMode: number;

  @ViewChild('initialAnswer') initialAnswerComponent: AssessmentAnswerComponent;

  @ViewChild('addAnswers', { read: ViewContainerRef }) addAnswers: ViewContainerRef;

  answersForm: FormGroup;

  private _sbS = new SubSink();

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.createFormGroup();

    if(!this.assessmentMode){
      this.updateFormGroup();
    }
  }

  ngAfterViewInit(): void {
    this.onInitialAnswerCreated();
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

  createFormGroup(){
    this.answersForm = this._formBuilder.group({
      answerForms: this._formBuilder.array([])
    });
  }

  updateFormGroup(){
    // Update form group values
  }

  onInitialAnswerCreated(){
    this.answerForms.push(this.initialAnswerComponent.answerForm); 
  }

  generateAnswerForm(){
    const component = this.addAnswers.createComponent(AssessmentAnswerComponent);
    component.instance.assessmentMode = 1;
    
    // Populate answers form array with answer form group after component is created
    this._sbS.sink = component.instance.created.pipe(tap((_created) => {
        if(_created){
          this.answerForms.push(component.instance.answerForm);
        }
        console.log(this.answerForms);
      })).subscribe();
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
