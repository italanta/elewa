import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { Observable, of, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { AssessmentFormService } from '../../services/assessment-form.service';


@Component({
  selector: 'app-assessment-edit',
  templateUrl: './assessment-edit.component.html',
  styleUrls: ['./assessment-edit.component.scss'],
})
export class AssessmentEditComponent implements OnInit, OnDestroy {
  assessment$: Observable<Assessment>;
  questions$: Observable<AssessmentQuestion[]>;
  pageTitle: string;
  assessmentTitle: string;
  assessmentDesc: string;

  assessmentMode: number;
  assessmentForm: FormGroup;

  private _sbS = new SubSink();
  
  constructor(private _assessment: AssessmentService,
              private _assessmentForm: AssessmentFormService,
              private _route: ActivatedRoute){}

  ngOnInit(): void {
    this.initAssessment();
    this.setPageTitle();
    this.createFormGroup();
  }

  initAssessment(){
    const assessmentId = this._route.snapshot.paramMap.get('id') as string;
    this.assessment$ = this._assessment.getAssessment$(assessmentId) as Observable<Assessment>; 
    this.questions$ = of([]);

    // Get assessment mode; 1 - Assessment Create  0 - Assessment Edit
    this.assessmentMode = Number(this._route.snapshot.queryParamMap.get('mode'));
  }

  setPageTitle(){
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) => {
        this.assessmentTitle = _assessment.title;
        this.assessmentDesc = _assessment.description;
        this.pageTitle = `Assessments/${this.assessmentTitle}/Edit`;
      })
    ).subscribe();
  }

  createFormGroup(){
    this.assessmentForm = this._assessmentForm.createAssessmentDetailForm();
  }

  onPublish(){
    // Add publish functionality
    
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
