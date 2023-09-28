import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, tap, switchMap, take } from 'rxjs';
import { flatten as __flatten } from 'lodash';
import { SubSink } from 'subsink';

import { Assessment, AssessmentMode, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentPublishService, AssessmentQuestionService, AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentsFormsModel } from '../../../model/questions-form.model';

import { AssessmentFormService } from '../../../services/assessment-form.service';
import { DEFAULT_ASSESSMENT } from '../../../providers/create-empty-assessment-form.provider';
@Component({
  selector: 'app-create-assessment-page',
  templateUrl: './create-assessment-page.component.html',
  styleUrls: ['./create-assessment-page.component.scss'],
})
export class CreateAssessmentPageComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  assessmentFormModel:  AssessmentsFormsModel;

  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  showPublishBtn$: Observable<boolean>;

  pageTitle: string;

  questions: AssessmentQuestion[];
  assessmentMode: AssessmentMode;
  assessment: Assessment = DEFAULT_ASSESSMENT();

  isPublishing = false;
  isSaving = false;
  formHasLoaded: boolean = false;

  action: string;

  constructor(private _fb: FormBuilder,
              private _route$$: Router,
              private _snackBar: MatSnackBar,
              private _assessmentService: AssessmentService,
              private _assessmentForm: AssessmentFormService,
              private _publishAssessment: AssessmentPublishService,
              private _assessmentQuestion: AssessmentQuestionService        
  ) {
    this.assessmentFormModel = new AssessmentsFormsModel(this._fb, _assessmentForm);
  }

  ngOnInit(): void
  {
    this.action = this._route$$.url.split('/')[2];

    if (this.action === 'create') {
      this.initializeEmptyAssessmentForm();
    } else {
      this.initPage();
    }
  }

  initializeEmptyAssessmentForm() {
    this.formHasLoaded = true;
  }

  initPage()
  {
    this.assessment$ = this._assessmentService.getActiveAssessment$();
    this.questions$ = this._assessmentQuestion.getQuestions$();

    this._sbS.sink = this.assessment$.pipe(
      take(1),
      tap((assessment) => {this.assessment = assessment}),
      switchMap((assessment) => this._assessmentQuestion.getQuestionsByAssessmentId$(assessment.id!)),
      take(1),
      tap((questions) => { 
        this.questions = questions;

        if (this.assessment?.questionsOrder) {
          var questionOrdering = {},
          sortOrder = this.assessment.questionsOrder;
          for (var i=0; i< sortOrder!.length; i++)
            questionOrdering[sortOrder![i]] = i;
  
          this.questions.sort( function(a, b) {
              return (questionOrdering[a.id!] - questionOrdering[b.id!]) || a.id!.localeCompare(b.id!);
          });
        }
                
        this.assessmentFormModel.assessmentsFormGroup = this._assessmentForm.createAssessmentDetailForm(this.assessment);
        this.formHasLoaded = true;
      })
    ).subscribe()
  }

  
  onSave()
  {
    this.isSaving = true;

    // since some observables complete before we call combinelatest, we initialise our stream with an empty string
    // we spread the `assessmentQstns$()` since it's an array of Observables.
    let savedAssessmentId: string = '';

    this.insertAssessmentConfig$().pipe(take(1),
        tap((ass) => savedAssessmentId = ass.id!),
        switchMap((ass) => this.persistAssessmentQuestions$(ass.id!)),
        tap(() => {
          this.isSaving = false;
          this.openSnackBar('Assessment successfully saved', 'Save')
          this._route$$.navigate([ 'assessments', savedAssessmentId]);
        })
      )
    .subscribe()
  }

  onPublish() {
    this.isPublishing = true;

    this._sbS.sink = this._publishAssessment.publish(this.assessment)
      .pipe(
        switchMap(() => {
          this.assessment.isPublished = true;
          return this._assessmentService.updateAssessment$(this.assessment);
        })
      )
      .subscribe((published) => {
        if (published) {
          this.isPublishing = false;
          this._sbS.unsubscribe();
          this.assessmentMode = AssessmentMode.View;
          this.openSnackBar('Assessment was successfully published', 'Publish');
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

  insertAssessmentConfig$()
  {
    this.assessment['configs'] = {
      feedback: this.assessmentFormModel.assessmentsFormGroup.value.configs.feedback,
      userAttempts: this.assessmentFormModel.assessmentsFormGroup.value.configs.userAttempts
    };

    let questionsOrder = this.assessmentFormModel.assessmentsFormGroup.value.questionsOrder;

    if (this.assessmentFormModel.assessmentsFormGroup.value.questions)
      questionsOrder = this.assessmentFormModel.assessmentsFormGroup.value.questions.map((q: AssessmentQuestion) => q.id);
    
    this.assessmentFormModel.assessmentsFormGroup.value['questionsOrder'] = questionsOrder;

    if (this.action === 'create')
      return this._assessmentService.addAssessment$(this.assessmentFormModel.assessmentsFormGroup.value as Assessment);

    return this._assessmentService.updateAssessment$(this.assessmentFormModel.assessmentsFormGroup.value as Assessment);
  }

  persistAssessmentQuestions$(assessmentId: string)
  {
    const assessmentQuestions: AssessmentQuestion[] = this.assessmentFormModel.assessmentsFormGroup.value.questions;
    return this._determineAssesActions(assessmentQuestions, assessmentId);
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * @param assessmentQuestions - The new questions
   * @returns A list of database actions to take.
  */
  private _determineAssesActions(assessmentQuestions: AssessmentQuestion[], assessmentId: string)
  {

    const oldQuestions = this.questions ?? [];
    const delQstns = oldQuestions.filter(oldQ => !assessmentQuestions.find(question => question.id === oldQ.id));

    delQstns.map(question => this._assessmentQuestion.deleteQuestion$(question));

    return assessmentQuestions.map(question => this._assessmentQuestion.addQuestion$(assessmentId, question, question.id!));
  }

  ngOnDestroy(): void
  {
    this.assessment = {} as any;
    this.questions = [];
    this._sbS.unsubscribe();
  }
}
