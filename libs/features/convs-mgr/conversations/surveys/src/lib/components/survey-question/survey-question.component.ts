import { Component, Input } from '@angular/core';
import { SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';

@Component({
  selector: 'app-survey-question',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.scss'],
})
export class SurveyQuestionComponent {
  @Input() question: SurveyQuestion;
  @Input() questionNo: number;
}
