import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'italanta-apps-assessment-edit',
  templateUrl: './assessment-edit.component.html',
  styleUrls: ['./assessment-edit.component.scss'],
})
export class AssessmentEditComponent implements OnInit, OnDestroy {
  assessment$: Observable<Assessment>;
  pageTitle: string;

  private _sbS = new SubSink();
  
  constructor(private _assessment: AssessmentService,
              private _route: ActivatedRoute){}

  ngOnInit(): void {
    this.initAssessment();
    this.setEditPageTitle();
  }

  initAssessment(){
    let assessmentId = this._route.snapshot.paramMap.get('id') as string;
    this.assessment$ = this._assessment.getAssessment$(assessmentId) as Observable<Assessment>; 
  }

  setEditPageTitle(){
    this._sbS.sink = this.assessment$.pipe(tap(
      (_assessment: Assessment) => {
        this.pageTitle = `Assessments/${_assessment.title}/Edit`;
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
