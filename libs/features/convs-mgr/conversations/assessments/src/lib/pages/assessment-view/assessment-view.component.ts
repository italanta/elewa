import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { Observable, concatMap, forkJoin, from, tap, timer } from 'rxjs';
import { flatten as __flatten } from 'lodash';
import { SubSink } from 'subsink';

import { Assessment, AssessmentMode, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentQuestionService, AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, OnDestroy {
  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  pageTitle: string;

  questions: AssessmentQuestion[]
 
  assessmentMode: AssessmentMode;
  assessmentForm: FormGroup;

  assessment: Assessment;

  private _sbS = new SubSink();
  isPublishing = false;
  
  constructor(
    private _assessmentSer: AssessmentService,
    private _assessmentForm: AssessmentFormService,
    private _assessmentQuestion: AssessmentQuestionService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.initAssessment();
    this.initPage();
  }

  initAssessment() {
    this.assessment$ = this._assessmentSer.getActiveAssessment$()
    this.questions$ = this._assessmentQuestion.getQuestions$()
    this._sbS.sink = this._assessmentQuestion.getQuestions$().subscribe(qstsn => this.questions = qstsn);
    this.assessmentMode = this.getAssessmentMode();
  }

  initPage(){
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) => {
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

  createFormGroup(){
    this.assessmentForm = this._assessmentForm.createAssessmentDetailForm(this.assessment?.configs);
  }

  getAssessmentMode(){
    const assessmentMode = this._route.snapshot.queryParamMap.get('mode') as string;

    // 1 = "Edit" & 0 = "View"
    if(assessmentMode === 'edit'){
      return AssessmentMode.Edit;
    } else {
      return AssessmentMode.View;
    }
  }

  onPublish(){
    this.isPublishing = true;

    // we spread the `persistAssessmentQuestions()` since it's an array of Observables.
    this._sbS.add(
      forkJoin([this.insertAssessmentConfig$(), ...this.persistAssessmentQuestions$()]).subscribe(_saved => {
        if(_saved){
          this.isPublishing = false
          this.assessmentMode = AssessmentMode.View;
          this._router.navigate(['/assessments', this.assessment.id], {queryParams: {mode: 'view'}});
        }
      })
    );
  }

  toggleForm(){
    this.assessmentMode = AssessmentMode.Edit;
    // Update url parameter mode to edit
    this._router.navigate(['/assessments', this.assessment.id], {queryParams: {mode: 'edit'}});
    this.pageTitle = `Assessments/${this.assessment.title}/${AssessmentMode[this.assessmentMode]}`;
    this.createFormGroup();
  }

  determineAction(){
    this.assessmentMode ? this.onPublish() : this.toggleForm();
  }

  insertAssessmentConfig$(){
    this.assessment.configs = {
      feedback: this.assessmentForm.value.configs.feedback,
      userAttempts: this.assessmentForm.value.configs.userAttempts
    }

    return this._assessmentSer.updateAssessment$(this.assessment);
  }

  persistAssessmentQuestions$(){
    const assessmentQuestions: AssessmentQuestion[] = this.assessmentForm.value.questions;
    return this._determineAssesActions(assessmentQuestions)
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * @param assessmentQuestions - The new questions
   * @returns A list of database actions to take.
  */
  private _determineAssesActions(assessmentQuestions: AssessmentQuestion[]) {
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
      concatMap((question, index) => {
        const delay = 10 * index; // Delay in milliseconds (0.01 second per question)
        return timer(delay).pipe(
          concatMap(() => this._assessmentQuestion.addQuestion$(question))
        );
      })
    );

    const updQstns$ = updQstns.map(question => this._assessmentQuestion.updateQuestion$(question));

    return __flatten([newQstns$, updQstns$, delQstns$]);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
