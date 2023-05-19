import { Component, Input } from '@angular/core';

import { AssessmentOptionValue, AssessmentQuestion, AssessmentQuestionType } from '@app/model/convs-mgr/conversations/assessments';


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.scss'],
})
export class AssessmentQuestionComponent {
  @Input() question: AssessmentQuestion;

  testquestion = {
    questionType: AssessmentQuestionType.SingleSelectOptions,
    marks: 20,
    feedback: '',
    message: 'What are examples of soil types?',
    options: [
      {
        id: '1',
        text: 'Loam, Sand, Clay',
        value: AssessmentOptionValue.Correct
      },
      {
        id: '1',
        text: 'Loam, Sand, Clay',
        value: AssessmentOptionValue.Correct
      },
      {
        id: '1',
        text: 'Loam, Sand, Clay',
        value: AssessmentOptionValue.Correct
      }
    ]
  }

  constructor(){}
}
