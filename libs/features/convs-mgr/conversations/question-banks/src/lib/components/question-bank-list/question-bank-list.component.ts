import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { orderBy as __orderBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { AssessmentQuestion, QuestionFormMode } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankStore } from '@app/state/convs-mgr/conversations/assessments';
import { AssessmentFormService, QuestionDisplayMode } from '@app/features/convs-mgr/conversations/assessments';

import { ActionSortingOptions } from '../../utils/sorting-options.enum';
import { AddQuestionToAssessmentComponent } from '../add-question-to-assessment/add-question-to-assessment.component';


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

  questionBankForm: FormGroup;

  private _sBS = new SubSink ();

  sorting$$ = new BehaviorSubject<ActionSortingOptions>(ActionSortingOptions.Newest);

  sortQuestionsBy = 'newest';                  

  constructor(private questionStore: AssessmentQuestionBankStore,
              private _dialog: MatDialog,
              private _fb: FormBuilder,
              private _assessmentForm: AssessmentFormService
  ) {}

  ngOnInit()
  {
    this.getQuestions();
    
    this._sBS.sink = this.sorting$$.subscribe(sort => {
      this.filteredQuestions = __orderBy(this.questions, 
        (d: any) => __DateFromStorage(d.createdOn).unix(), 
        sort === ActionSortingOptions.Newest ? 'desc' : 'asc');
    });

    // Create a question bank form to store our array of questions
    this.questionBankForm = this._fb.group({
      questions: this._fb.array([])
    });
  }

  get questionsList() {
    return this.questionBankForm.get('questions') as FormArray;
  }

  getQuestions() 
  {
    this._sBS.sink = this.questionStore.get().subscribe(_res => {
      this.questions = _res;
      this.filteredQuestions = _res;

      const questions = this._fb.array(this.questions.map(q => this._assessmentForm.createQuestionForm(q)))
      this.questionBankForm.setControl('questions', questions);
    });
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
  sortBy(event: Event)
  {
    const sortValue = (event.target as HTMLInputElement).value as ActionSortingOptions;
    this.sortQuestionsBy = sortValue;
    this.sorting$$.next(sortValue);
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
