import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AssessmentOptionValue } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-answer',
  templateUrl: './assessment-answer.component.html',
  styleUrls: ['./assessment-answer.component.scss'],
})
export class AssessmentAnswerComponent  {
  @Input() questionFormGroup: FormGroup;
  @Input() answerFormGroupName: number;

  @Output() deleteChoice = new EventEmitter<number>();

  correct = AssessmentOptionValue.Correct;
  wrong = AssessmentOptionValue.Wrong;
  fiftyFifty = AssessmentOptionValue.FiftyFifty;

  delete() {
    this.deleteChoice.emit(this.answerFormGroupName);
  }
}
