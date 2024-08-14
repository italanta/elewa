import { Component, Input } from '@angular/core';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent 
{
  @Input() question: AssessmentQuestion

  editQuestion()
  {

  }

  deleteQuestion()
  {
    
  }
}
