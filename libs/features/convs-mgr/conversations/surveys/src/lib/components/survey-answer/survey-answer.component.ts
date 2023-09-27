import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SurveyOptionValue } from '@app/model/convs-mgr/conversations/surveys';

@Component({
  selector: 'app-survey-answer',
  templateUrl: './survey-answer.component.html',
  styleUrls: ['./survey-answer.component.scss'],
})
export class SurveyAnswerComponent {
  @Input() questionFormGroup: FormGroup;
  @Input() answerFormGroupName: number;

  @Output() deleteChoice = new EventEmitter<number>();
  @Output() answerClicked = new EventEmitter();

  showFeedback = false;

  correct = SurveyOptionValue.Correct;
  wrong = SurveyOptionValue.Wrong;
  fiftyFifty = SurveyOptionValue.FiftyFifty;

  setFeedback() {
    this.showFeedback = !this.showFeedback;
  }

  delete() {
    this.deleteChoice.emit(this.answerFormGroupName);
  }
}
