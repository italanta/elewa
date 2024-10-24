import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { AssessmentQuestion, QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';
import { AssessmentFormService, QuestionDisplayMode } from '@app/features/convs-mgr/conversations/assessments';

import { DeleteQuestionModalComponent } from '../delete-question-modal/delete-question-modal.component';


@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent implements OnDestroy
{
  /** Specific question */
  @Input() question: AssessmentQuestion;
  /** Question form group */
  questionsFormGroup: FormGroup;
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

  constructor (private _questionStore: AssessmentQuestionBankStore,
               private _dialog: MatDialog, 
               private _assessmentForm: AssessmentFormService
  ){}

  /** Triggering form output for editing an existing question
   * Build form with existing data
  */
  editQuestion() {
    this.addAQuestion = true;
    
    this.questionsFormGroup = this._assessmentForm.createQuestionForm(this.question);
    
    this.addNewQuestion.emit(this.questionsFormGroup);
    
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
        data: { question: this.question},
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
