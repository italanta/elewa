import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.component.html',
  styleUrls: ['./assessment-questions.component.scss'],
})
export class AssessmentQuestionsComponent implements OnInit {
  @Input() questions: AssessmentQuestion[]
  @Input() assessmentMode: number;

  @Input() assessmentFormGroup: FormGroup;

  constructor(private _assessmentForm: AssessmentFormService){}

  ngOnInit(): void {
    this.generateQuestionForm();
  }

  get questionsList(){
    return this.assessmentFormGroup.get('questionsList') as FormArray;
  }

  generateQuestionForm(){
    this.questionsList.push(this._assessmentForm.createQuestionForm());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterQuestions(event: Event){
    // Add filter question functionality
  }
}
