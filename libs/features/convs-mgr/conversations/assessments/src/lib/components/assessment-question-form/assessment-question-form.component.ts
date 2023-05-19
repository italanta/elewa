import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';


@Component({
  selector: 'app-assessment-question-form',
  templateUrl: './assessment-question-form.component.html',
  styleUrls: ['./assessment-question-form.component.scss'],
})
export class AssessmentQuestionFormComponent implements OnInit {
  @Input() question: AssessmentQuestion = {} as AssessmentQuestion;
  @Input() questionNo: number;

  @Input() assessmentMode: number;
  
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;

  ngOnInit(): void {
    if(!this.question.id){
      this.questionFormGroup.patchValue({
        id: `${this.questionNo}`
      });
    }
  }

  get questionFormGroup(){
    const questionsFormArray = this.assessmentFormGroup.get('questions') as FormArray;
    return questionsFormArray.controls[this.questionFormGroupName as number] as FormGroup;
  }

}
