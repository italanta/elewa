import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

  delete() {
    this.deleteChoice.emit(this.answerFormGroupName);
  }
}
