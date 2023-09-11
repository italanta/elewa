import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, concatMap, combineLatest, from, tap, timer, startWith, switchMap, finalize, take, takeLast } from 'rxjs';
import { flatten as __flatten } from 'lodash';
import { SubSink } from 'subsink';

import { Assessment, AssessmentMode, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentPublishService, AssessmentQuestionService, AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../../services/assessment-form.service';
import { CREATE_EMPTY_ASSESSMENT_FORM, DEFAULT_ASSESSMENT } from '../../../providers/create-empty-assessment-form.provider';
@Component({
  selector: 'app-create-assessment-page',
  templateUrl: './create-assessment-page.component.html',
  styleUrls: ['./create-assessment-page.component.scss'],
})
export class CreateAssessmentPageComponent implements OnInit {
  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  pageTitle: string;

  questions: AssessmentQuestion[];

  assessmentMode: AssessmentMode;
  assessmentForm: FormGroup;

  assessment: Assessment = DEFAULT_ASSESSMENT();

  private _sbS = new SubSink();
  isPublishing = false;
  showPublishBtn:Observable<boolean>;
  isSaving = false;

  action: string;

  formHasLoaded: boolean = false;

  constructor(private _fb: FormBuilder,
              private _route$$: Router,
              private _route:ActivatedRoute,
              private _snackBar: MatSnackBar,
              private _assessmentService: AssessmentService,
              private _assessmentForm: AssessmentFormService,
              private _publishAssessment: AssessmentPublishService,
              private _assessmentQuestion: AssessmentQuestionService        
  ) {}

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
    this.assessmentForm = CREATE_EMPTY_ASSESSMENT_FORM(this._fb);
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
        this.assessmentForm = this._assessmentForm.createAssessmentDetailForm(this.assessment);
        this.formHasLoaded = true;
        debugger
      })
    ).subscribe()

    // this._sbS.sink = combineLatest([this.assessment$, ]).pipe(
    //   tap(
    //   ([_assessment, questions]) =>
    //   {
    //   })
    // ).subscribe();
  }

  onSave()
  {
    this.isSaving = true;

    // since some observables complete before we call combinelatest, we initialise our stream with an empty string
    // const assessmentQstns$ = 

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
      feedback: this.assessmentForm.value.configs.feedback,
      userAttempts: this.assessmentForm.value.configs.userAttempts
    };
    
    if (this.action === 'create')
      return this._assessmentService.addAssessment$(this.assessmentForm.value as Assessment);

    return this._assessmentService.updateAssessment$(this.assessmentForm.value as Assessment);
  }

  persistAssessmentQuestions$(assessmentId: string)
  {
    const assessmentQuestions: AssessmentQuestion[] = this.assessmentForm.value.questions;
    return this._determineAssesActions(assessmentQuestions, assessmentId);
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * @param assessmentQuestions - The new questions
   * @returns A list of database actions to take.
  */
  private _determineAssesActions(assessmentQuestions: AssessmentQuestion[], assessmentId: string)
  {
    // get's the latest questions from the state().
    // this.preloadQuestions();

    const oldQuestions = this.questions ?? [];

    // Assessments which are newly created and newly configured
    // const newQstns = assessmentQuestions.filter(question => !oldQuestions.find(oldQ => oldQ.id === question.id));

    // // Assessments which were updated.
    // const updQstns = assessmentQuestions.filter(question => !newQstns.find(newQ => newQ.id === question.id));

    const delQstns = oldQuestions.filter(oldQ => !assessmentQuestions.find(question => question.id === oldQ.id));

    delQstns.map(question => this._assessmentQuestion.deleteQuestion$(question));

    // we set a delay here so we can maintain a consistent order on our questions
    // TODO: replace with drag and drop feature

    // const newQstns$ = from(newQstns).pipe(
    //   concatMap((question, index) =>
    //   {
    //     const delay = 10 * index; // Delay in milliseconds (0.01 second per question)
    //     return timer(delay).pipe(
    //       concatMap(() => this._assessmentQuestion.addQuestion$(assessmentId, question, question.id as string))
    //     );
    //   })
    // );

    return assessmentQuestions.map(question => this._assessmentQuestion.addQuestion$(assessmentId, question, question.id!));

    // return __flatten([newQstns$, updQstns$, delQstns$]);
  }

  ngOnDestroy(): void
  {
    this.questions = [];
    this._sbS.unsubscribe();
  }
}
