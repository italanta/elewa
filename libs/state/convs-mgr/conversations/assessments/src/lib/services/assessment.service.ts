import { Injectable } from '@angular/core';

import { from, map, switchMap, take, toArray } from 'rxjs';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { AssessmentsStore } from '../stores/assessments.store';
import { ActiveAssessmentStore } from '../stores/active-assessment.store';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  constructor(private _assessments$$: AssessmentsStore,
              private _orgId$$: ActiveOrgStore,
              private _activeAssessment$$: ActiveAssessmentStore
  ) {}

  getActiveAssessment$() {
    return this._activeAssessment$$.get();
  }

  getAssessments$() {
    return this._assessments$$.get();
  }

  addAssessment$(assessment: Assessment) {
    // Create v2(micro-app enabled) assessments by default
    assessment.version == 'v2';
    return this._assessments$$.createAssessment(assessment);
  }

  updateAssessment$(assessment: Assessment) {
    return this._assessments$$.update(assessment);
  }

  deleteAssessment$(oldAssessment: Assessment) {
    return this._assessments$$.remove(oldAssessment)
  }

  getAssessmentOrg$ = () => this._orgId$$.get().pipe(take(1), map((_org) => _org.id));

  getAssessment$(assessmentId: string) {
    return this._assessments$$.getOne(assessmentId);
  }

  getPublishedAssessments$(){
    return this._assessments$$.get().pipe(
      map((assessments: Assessment[]) => assessments.filter(assessment => assessment.isPublished))
    );
  }
  
}
