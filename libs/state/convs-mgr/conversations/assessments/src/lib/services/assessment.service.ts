import { Injectable } from '@angular/core';

import { map, take } from 'rxjs';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';
import { ActiveOrgStore } from '@app/state/organisation';


@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private _assessments$$: AssessmentsStore,
              private _orgId$$: ActiveOrgStore) { }

  getAssessments$(){
    return this._assessments$$.get();
  }

  addAssessment$(assessment: Assessment){
    return this._assessments$$.add(assessment);
  }

  getAssessmentOrg$ = () => this._orgId$$.get().pipe(take(1), map((_org) => _org.id));

  getAssessment$(assessmentId: string){
    return this._assessments$$.getOne(assessmentId);
  }
  
}
