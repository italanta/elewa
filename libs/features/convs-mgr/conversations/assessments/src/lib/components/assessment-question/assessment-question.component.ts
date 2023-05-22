import { Component, Input } from '@angular/core';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.scss'],
})
export class AssessmentQuestionComponent {
  @Input() question: AssessmentQuestion;
  @Input() questionNo: number;
}
