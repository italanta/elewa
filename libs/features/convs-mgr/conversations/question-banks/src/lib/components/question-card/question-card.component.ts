import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';
import { QuestionDisplayMode } from '@app/features/convs-mgr/conversations/assessments';

import { DeleteQuestionModalComponent } from '../delete-question-modal/delete-question-modal.component';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent implements OnDestroy
{
  /** Specific question */
  @Input() questionBankForm: FormGroup;
  @Input() questionFormGroupName: number;

  /** Adding a question state */
  addAQuestion: boolean;
  formViewMode: QuestionFormMode;
  questionDisplayMode: QuestionDisplayMode;
  /** Editor mode */
  isAddingQuestion = false;
  /** Emit question form t parent (QuestionsList) */
  @Output() addNewQuestion = new EventEmitter<FormGroup>();
  @Output() addMode = new EventEmitter<boolean>();
  @Output() viewMode = new EventEmitter<QuestionFormMode>();
  @Output() questionDisplayModeChange = new EventEmitter<QuestionDisplayMode>();

  private _sBS = new SubSink ();

  constructor (private _dialog: MatDialog){}

  get questionsList() {
    return this.questionBankForm.get('questions') as FormArray;
  }

  get questionFormGroup() {
    return this.questionsList?.at(this.questionFormGroupName) as FormGroup;
  }

  get mediaType() {
    return this.questionFormGroup?.get('mediaType');
  }

  get mediaPath() {
    return this.questionFormGroup?.get('mediaPath');
  }

  get mediaAlign() {
    this.questionFormGroup?.get('mediaAlign')?.value;
    return this.questionFormGroup?.get('mediaAlign');
  }

  /** Triggering form output for editing an existing question
   * Build form with existing data
  */
  editQuestion() {
    this.addAQuestion = true;
    
    this.addNewQuestion.emit(this.questionFormGroup);
    
    this.formViewMode = QuestionFormMode.QuestionBankMode;

    this.viewMode.emit(this.formViewMode);
    
    this.questionDisplayMode = QuestionDisplayMode.EDITING;
    
    this.questionDisplayModeChange.emit(this.questionDisplayMode);
  }
  
  /** Function to remove a question from the question banks */
  deleteQuestion()
  {
    this._dialog.open(DeleteQuestionModalComponent, 
      {
        data: { question: this.questionFormGroup.value},
      }
    )
  }

  onQuestionActionCompleted() 
  {
    this.isAddingQuestion = false;
    this.addAQuestion = false;
  }

  ngOnDestroy(): void
  {
   this._sBS.unsubscribe()   
  }
}
