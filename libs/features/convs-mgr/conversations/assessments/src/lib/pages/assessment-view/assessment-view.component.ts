import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, concatMap, combineLatest, from, tap, timer, startWith, switchMap, finalize } from 'rxjs';
import { flatten as __flatten } from 'lodash';
import { SubSink } from 'subsink';

import { Assessment, AssessmentMode, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentPublishService, AssessmentQuestionService, AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';
import { AssessToggleStateService } from '../../services/assessment-toggle-state.service';


@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, OnDestroy
{
  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  pageTitle: string;

  questions: AssessmentQuestion[];

  assessmentMode: AssessmentMode;
  assessmentForm: FormGroup;

  assessment: Assessment;

  private _sbS = new SubSink();
  isPublishing = false;
  showPublishBtn:Observable<boolean>;
  isSaving = false;

  constructor(
    private _assessmentService: AssessmentService,
    private _publishAssessment: AssessmentPublishService,
    private _assessmentForm: AssessmentFormService,
    private _assessmentQuestion: AssessmentQuestionService,
    private _assessToggle: AssessToggleStateService,
    private _snackBar: MatSnackBar, 
    private _route:ActivatedRoute
  ) {}

  ngOnInit(): void
  {
    this.initAssessment();
    this.initPage();
    this.showPublishBtn = this._assessToggle.publishBtnState;
  }

  initAssessment()
  {
    this.assessment$ = this._assessmentService.getActiveAssessment$();
    this.questions$ = this._assessmentQuestion.getQuestions$();
    this.preloadQuestions();

    this._sbS.sink = this._route.queryParamMap.subscribe(params => {
      const mode = params.get('mode');

      if (mode === 'edit') {
        this.assessmentMode = AssessmentMode.Edit;
        this._assessToggle.hidePublish();
      } else {
        this.assessmentMode = AssessmentMode.View;
      }
    });
  }

  initPage()
  {
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) =>
      {
        this.assessment = _assessment;
        // Initialize the page title
        this.pageTitle = `Assessments/${this.assessment.title}/${AssessmentMode[this.assessmentMode]}`;
        // Initialize assessment form
        if (this.assessmentMode) {
          this.createFormGroup();
        }
      })
    ).subscribe();
  }

  createFormGroup()
  {
    this.assessmentForm = this._assessmentForm.createAssessmentDetailForm(this.assessment?.configs);
  }

  preloadQuestions() {
    this._sbS.sink = this._assessmentQuestion.getQuestions$().subscribe(qstsn => this.questions = qstsn);
  }

  onSave()
  {
    this.isSaving = true;

    // since some observables complete before we call combinelatest, we initialise our stream with an empty string
    const assessmentQstns$ = this.persistAssessmentQuestions$().map(each => each.pipe(startWith('')))

    // we spread the `assessmentQstns$()` since it's an array of Observables.
    this._sbS.add(
      combineLatest([this.insertAssessmentConfig$(), ...assessmentQstns$])
        .pipe(
          finalize(() => {
            this.isSaving = false;
            this._assessToggle.showPublish();
            this.openSnackBar('Assessment successfully saved', 'Save')
          })
        )
      .subscribe()
    );
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

  toggleForm()
  {
    this._sbS.unsubscribe();
    this.assessmentMode = AssessmentMode.Edit;
    this._assessToggle.hidePublish();

    // Update url parameter mode to edit
    this.pageTitle = `Assessments/${this.assessment.title}/${AssessmentMode[this.assessmentMode]}`;
    this.createFormGroup();
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
    this.assessment.configs = {
      feedback: this.assessmentForm.value.configs.feedback,
      userAttempts: this.assessmentForm.value.configs.userAttempts
    };

    return this._assessmentService.updateAssessment$(this.assessment);
  }

  persistAssessmentQuestions$()
  {
    const assessmentQuestions: AssessmentQuestion[] = this.assessmentForm.value.questions;
    return this._determineAssesActions(assessmentQuestions);
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * @param assessmentQuestions - The new questions
   * @returns A list of database actions to take.
  */
  private _determineAssesActions(assessmentQuestions: AssessmentQuestion[])
  {
    // get's the latest questions from the state().
    this.preloadQuestions();

    const oldQuestions = this.questions;

    // Assessments which are newly created and newly configured
    const newQstns = assessmentQuestions.filter(question => !oldQuestions.find(oldQ => oldQ.id === question.id));

    // Assessments which were updated.
    const updQstns = assessmentQuestions.filter(question => !newQstns.find(newQ => newQ.id === question.id));

    const delQstns = oldQuestions.filter(oldQ => !assessmentQuestions.find(question => question.id === oldQ.id));

    const delQstns$ = delQstns.map(question => this._assessmentQuestion.deleteQuestion$(question));

    // we set a delay here so we can maintain a consistent order on our questions
    // TODO: replace with drag and drop feature
    const newQstns$ = from(newQstns).pipe(
      concatMap((question, index) =>
      {
        const delay = 10 * index; // Delay in milliseconds (0.01 second per question)
        return timer(delay).pipe(
          concatMap(() => this._assessmentQuestion.addQuestion$(question, question.id as string))
        );
      })
    );

    const updQstns$ = updQstns.map(question => this._assessmentQuestion.updateQuestion$(question));

    return __flatten([newQstns$, updQstns$, delQstns$]);
  }

  ngOnDestroy(): void
  {
    this._sbS.unsubscribe();
  }
}
