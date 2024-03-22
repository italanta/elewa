import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Observable, tap,switchMap,take } from 'rxjs';
import { flatten as __flatten } from 'lodash';
import { SubSink } from 'subsink';

import { Survey, SurveyMode, SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';
import { SurveyPublishService, SurveyQuestionService, SurveyService } from '@app/state/convs-mgr/conversations/surveys';

import { SurveyFormService } from '../../services/survey-form.service';
import { DEFAULT_SURVEY } from '../../provider/create-empty-survey-form.provider';
import { SurveysFormsModel } from '../../model/question-form.model';
import { SendModalComponent } from '../../modals/send-modal/send-modal.component';

@Component({
  selector: 'app-create-survey-flow',
  templateUrl: './create-survey-flow.component.html',
  styleUrls: ['./create-survey-flow.component.scss'],
})
export class CreateSurveyFlowComponent implements OnInit, OnDestroy{
  private _sbS = new SubSink();

  surveyFormModel: SurveysFormsModel;
  survey$: Observable<Survey>;
  questions$: Observable<SurveyQuestion[]>;
  pageTitle: string;

  questions: SurveyQuestion[];

  surveyMode: SurveyMode;
  surveyForm: FormGroup;

  survey: Survey = DEFAULT_SURVEY();

  isPublishing = false;
  showPublishBtn:Observable<boolean>;
  isSaving = false;

  action: string;
  channelId: string;

  formHasLoaded = false;

  constructor(private _fb: FormBuilder,
              private _route$$: Router,
              private _snackBar: MatSnackBar,
              private _surveyService: SurveyService,
              private _surveyForm: SurveyFormService,
              private _publishSurvey: SurveyPublishService,
              private _surveyQuestion: SurveyQuestionService,
              private _dialog: MatDialog     
  ) {
    this.surveyFormModel = new SurveysFormsModel(this._fb, _surveyForm)
  }

  ngOnInit(): void
  {
    this.action = this._route$$.url.split('/')[2];

    if (this.action === 'create') {
      this.initializeEmptySurveyForm();
    } else {
      this.initPage();
    }
  }

  initializeEmptySurveyForm() {
    this.formHasLoaded = true;
  }

  initPage()
  {
    this.survey$ = this._surveyService.getActiveSurvey$();
    this.questions$ = this._surveyQuestion.getQuestions$();

    this._sbS.sink = this.survey$.pipe(
      take(1),
      tap((survey) => {this.survey = survey}),
      switchMap((survey) => this._surveyQuestion.getQuestionsBySurveyId$(survey.id as string)),
      take(1),
      tap((questions) => { 
        this.questions = questions;
        if (this.survey?.questionsOrder) {
          const questionOrdering = {},
          sortOrder = this.survey.questionsOrder;
      
          for (let i=0; i< sortOrder.length; i++)
            questionOrdering[sortOrder[i]] = i;

          this.questions.sort( function(a, b) {
              return (questionOrdering[a.id as string] - questionOrdering[b.id as string]) || (a.id as string).localeCompare(b.id as string);
          });
        }

        this.surveyFormModel.surveysFormGroup = this._surveyForm.createSurveyDetailForm(this.survey);
        this.formHasLoaded = true;
      })
    ).subscribe()
  }

  getChannelId() {
    this.channelId = localStorage.getItem('selectedChannelId') || '';
  }

  onSave()
  {
    this.isSaving = true;

    // since some observables complete before we call combinelatest, we initialise our stream with an empty string

    // we spread the `surveyQstns$()` since it's an array of Observables.
    let savedSurveyId = '';

    this._sbS.sink = this.insertSurveyConfig$().pipe(take(1),
        tap((ass) => savedSurveyId = ass.id as string),
        switchMap((ass) => this.persistSurveyQuestions$(ass.id as string)),
        tap(() => {
          this.isSaving = false;
          this.openSnackBar('Survey successfully saved', 'Save')
          this._route$$.navigate([ 'surveys', savedSurveyId]);
        })
      )
    .subscribe()
  }

  onSendSurvey() {
    this.onPublish();
    this.getChannelId();
  
    if (this.channelId) {
      const dialogRef = this._dialog.open(SendModalComponent);
      dialogRef.afterClosed();
    } else{
      this.openSnackBar('Select a Channel to continue', 'Send Survey');
    }
  }

  onPublish() {
    this.isPublishing = true;

    this._sbS.sink = this._publishSurvey.publish(this.survey)
      .pipe(
        switchMap(() => {
          this.survey.isPublished = true;
          return this._surveyService.updateSurvey$(this.survey);
        })
      )
      .subscribe((published) => {
        if (published) {
          this.isPublishing = false;
          this._sbS.unsubscribe();
          this.surveyMode = SurveyMode.View;
          // this.openSnackBar('Survey was successfully published', 'Publish');
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: 'snack_color',
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000
    });
  }

  insertSurveyConfig$()
  {
    this.survey['configs'] = {
      feedback: this.surveyFormModel.surveysFormGroup.value.configs.feedback,
      userAttempts: this.surveyFormModel.surveysFormGroup.value.configs.userAttempts
    };

    let questionsOrder = this.surveyFormModel.surveysFormGroup.value.questionsOrder;

    if (this.surveyFormModel.surveysFormGroup.value.questions)
      questionsOrder = this.surveyFormModel.surveysFormGroup.value.questions.map((q: SurveyQuestion) => q.id);

    this.surveyFormModel.surveysFormGroup.value['questionsOrder'] = questionsOrder;
    
    if (this.action === 'create')
      return this._surveyService.addSurvey$(this.surveyFormModel.surveysFormGroup.value as Survey);

    return this._surveyService.updateSurvey$(this.surveyFormModel.surveysFormGroup.value as Survey);
  }

  persistSurveyQuestions$(surveyId: string)
  {
    const surveyQuestions: SurveyQuestion[] = this.surveyFormModel.surveysFormGroup.value.questions;
    return this._determineAssesActions(surveyQuestions, surveyId);
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * @param surveyQuestions - The new questions
   * @returns A list of database actions to take.
  */
  private _determineAssesActions(surveyQuestions: SurveyQuestion[], surveyId: string)
  {
    const oldQuestions = this.questions ?? [];

    const delQstns = oldQuestions.filter(oldQ => !surveyQuestions.find(question => question.id === oldQ.id));

    delQstns.map(question => this._surveyQuestion.deleteQuestion$(question));

    return surveyQuestions.map(question => this._surveyQuestion.addQuestion$(surveyId, question, question.id as string));

  }

  ngOnDestroy(): void
  {
    this.survey = {} as any;
    this.questions = [];
    this._sbS.unsubscribe();
  }
}
