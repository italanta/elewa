import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AssessmentFormService } from '@app/features/convs-mgr/conversations/assessments';

@Component({
  selector: 'lib-question-bank-list-component',
  templateUrl: './question-bank-list.component.html',
  styleUrl: './question-bank-list.component.scss'
})
export class QuestionBankListComponent implements OnInit
{
  questionsFormGroup: FormGroup;
  isAddingQuestion = false;

  constructor(private _assessmentForm: AssessmentFormService) {}

  ngOnInit(): void {}

  onNewQuestionAdded(questionFormGroup: FormGroup)
   {
    this.questionsFormGroup = questionFormGroup;
  }

  onAddModeChanged(addMode: boolean)
  {
    this.isAddingQuestion = addMode;
  }
}
