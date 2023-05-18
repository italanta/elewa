import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit, OnDestroy {
  assessment$: Observable<Assessment>;
  pageTitle: string;

  private _sbS = new SubSink();

  constructor(private _assessment: AssessmentService,
              private _route: ActivatedRoute){}

  ngOnInit(): void {
    this.initiaizeAssessment();
    this.setViewPageTitle();
  }

  initiaizeAssessment(){
    const assessmentId = this._route.snapshot.paramMap.get('id') as string;
    this.assessment$ = this._assessment.getAssessment$(assessmentId) as Observable<Assessment>; 
  }

  setViewPageTitle(){
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) => {
        this.pageTitle = `Assessments/${_assessment.title}/View`;
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }

}
