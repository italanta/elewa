import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';


@Component({
  selector: 'convl-italanta-apps-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.scss'],
})
export class AssessmentQuestionComponent {
  @Input() question: AssessmentQuestion = {} as AssessmentQuestion;
  @Input() questionNo: number;

  @Input() assessmentMode: number;
  
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;

  constructor(){}

  get questionFormGroup(){
    let questionsFormArray = this.assessmentFormGroup.get('questionForms') as FormArray;
    return questionsFormArray.controls[this.questionFormGroupName as number] as FormGroup;
  }

}
