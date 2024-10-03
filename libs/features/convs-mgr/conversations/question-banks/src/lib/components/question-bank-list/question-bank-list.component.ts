import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { AssessmentQuestion, QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';

import { AddQuestionToAssessmentComponent } from '../add-question-to-assessment/add-question-to-assessment.component';
import { QuestionDisplayMode } from '@app/features/convs-mgr/conversations/assessments';


@Component({
  selector: 'lib-question-bank-list-component',
  templateUrl: './question-bank-list.component.html',
  styleUrl: './question-bank-list.component.scss'
})
export class QuestionBankListComponent implements OnInit, OnDestroy
{
  /** Qestion form group */
  questionsFormGroup: FormGroup;
  /** Editor mode */
  isAddingQuestion = false;
  /** List of questions */
  questions: AssessmentQuestion[] = [];
  /** Filtered questions on search */
  filteredQuestions: AssessmentQuestion[] = [];
  /** Text written on search */
  searchTerm = '';
  /** Number of selected questions */
  selectedQuestions: string[] = [];
  /** Assessment or question bank */
  formViewMode: QuestionFormMode;
  /** Editing or viewing a questiion */
  questionDisplayMode: QuestionDisplayMode;
  private _sBS = new SubSink ();

  constructor(private questionStore: AssessmentQuestionBankStore,
              private _dialog: MatDialog,
  ) {}

  ngOnInit()
  {
    this._sBS.sink = this.questionStore.get().subscribe(_res => {
      this.questions = _res;
      this.filteredQuestions = _res;
    })
  }

  /** Sending form group to event */
  onNewQuestionAdded(questionFormGroup: FormGroup)
  {
    this.questionsFormGroup = questionFormGroup;
  }

  /** Listening to add clicked */
  onAddModeChanged(addMode: boolean)
  {
    this.isAddingQuestion = addMode;
  }

  selectQuestion(questionId: string, event: Event)
  {
    const checkbox = (event.target as HTMLInputElement).checked;

    if (checkbox) {
      this.selectedQuestions.push(questionId);
    } else {
      const index = this.selectedQuestions.indexOf(questionId);
      if (index !== -1) {
        this.selectedQuestions.splice(index, 1); // Remove the question ID if unchecked
      }
    }
  }

  onViewModeChanged(formViewMode: QuestionFormMode)
  {
    this.formViewMode = formViewMode
  }
  /** handle question display mode changes */
  onQuestionDisplayModeChanged(displayMode: QuestionDisplayMode) {
    this.questionDisplayMode = displayMode;
  }

  /** Opening the add question to assessment  */
  addQuestion() 
  {
    const dialogRef = this._dialog.open(AddQuestionToAssessmentComponent, {
      data: { question: this.questions.filter(question => this.selectedQuestions.includes(question.id!)) },
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.selectedQuestions.forEach(id => {
        const checkbox = document.querySelector(`input[type="checkbox"][value="${id}"]`) as HTMLInputElement;
        if (checkbox) checkbox.checked = false; // Uncheck the checkbox
      });
      this.selectedQuestions = [];
      this.isAddingQuestion = false;
    });
  }
  

  /** Seach for specific question text */
  searchQuestion() 
  {
    if (!this.searchTerm.trim()) {
      this.filteredQuestions = this.questions; // If no search term, show all questions
    } else {
      this.filteredQuestions = this.questions.filter((question) =>
        question.message.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  /** Sort according to date added */
  sortDates()
  {
    this.questions.sort((a, b) => {
      if (a.createdOn && b.createdOn) {
        return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
      }
      return 0; 
    });
  }

  onQuestionActionCompleted() 
  {
    this.isAddingQuestion = false
  }

  ngOnDestroy(): void 
  {
    this._sBS.unsubscribe()
  }
}
