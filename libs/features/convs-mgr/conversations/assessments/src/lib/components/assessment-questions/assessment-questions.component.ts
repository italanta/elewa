import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'convl-italanta-apps-assessment-questions',
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

  get questionForms(){
    return this.assessmentFormGroup.get('questionForms') as FormArray;
  }

  generateQuestionForm(){
    this.questionForms.push(this._assessmentForm.createQuestionForm());
  }

  filterQuestions(event: Event){

  }
}
