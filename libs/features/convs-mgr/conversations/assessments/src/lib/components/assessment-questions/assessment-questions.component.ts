import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.component.html',
  styleUrls: ['./assessment-questions.component.scss'],
})
export class AssessmentQuestionsComponent {
  @Input() questions$: Observable<AssessmentQuestion[]>;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterQuestions(event: Event){
    // Add filter question functionality
  }
}
