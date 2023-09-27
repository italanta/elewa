import { Component, Input } from '@angular/core';
import { SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';

import { Observable } from 'rxjs';
@Component({
  selector: 'app-survey-questions',
  templateUrl: './survey-questions.component.html',
  styleUrls: ['./survey-questions.component.scss'],
})
export class SurveyQuestionsComponent {
  @Input() questions$: Observable<SurveyQuestion[]>;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterQuestions(event: Event){
    // Add filter question functionality
  }
}
