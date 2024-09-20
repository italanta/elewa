import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AssessmentOptionValue } from '@app/model/convs-mgr/conversations/assessments';
import { QuestionDisplayMode } from '../../model/question-display-mode.enum';

@Component({
  selector: 'app-assessment-answer',
  templateUrl: './assessment-answer.component.html',
  styleUrls: ['./assessment-answer.component.scss'],
})
export class AssessmentAnswerComponent implements OnInit  {
  @Input() questionFormGroup: FormGroup;
  @Input() answerFormGroupName: number;
  @Input() questionMode: QuestionDisplayMode;
  @Input() questionBankForm: FormGroup;
  @Output() deleteChoice = new EventEmitter<number>();
  @Output() answerClicked = new EventEmitter();

  showFeedback = false;

  modeToDisplay = QuestionDisplayMode

  correct = AssessmentOptionValue.Correct;
  wrong = AssessmentOptionValue.Wrong;
  fiftyFifty = AssessmentOptionValue.FiftyFifty;

  ngOnInit()
  {
    if(!this.questionBankForm) this.questionMode = QuestionDisplayMode.EDITING
  }
  setFeedback() {
    this.showFeedback = !this.showFeedback;
  }

  delete() {
    this.deleteChoice.emit(this.answerFormGroupName);
  }
}
