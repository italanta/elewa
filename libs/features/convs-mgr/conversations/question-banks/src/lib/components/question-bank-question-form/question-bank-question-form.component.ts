import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-question-bank-question-form',
  templateUrl: './question-bank-question-form.component.html',
  styleUrl: './question-bank-question-form.component.scss',
})
export class QuestionBankQuestionFormComponent 
{
  @Input() questionFormGroup: FormGroup;
  question: AssessmentQuestion;
  questionId: string;

}
