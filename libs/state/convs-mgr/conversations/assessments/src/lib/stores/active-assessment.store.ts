import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { Store } from "@iote/state";
import { combineLatest, filter, map, tap } from "rxjs";

import { Assessment } from "@app/model/convs-mgr/conversations/assessments";
import { AssessmentsStore } from "./assessments.store";



@Injectable()
export class ActiveAssessmentStore extends Store<Assessment> {
  protected store = 'active-assessment-store';
  _activeAssessment: string;

  constructor(private _assessments$$: AssessmentsStore,
              private _route: Router)
  {
    super(null as any);
    
    const assessments$ = this._assessments$$.get();

    const route$ = this._route.events.pipe(
      filter((_event) => _event instanceof NavigationEnd),
      map((_event) => _event as NavigationEnd)
    );

    this._sbS.sink = combineLatest([assessments$, route$]).pipe(
      tap(([assessments, route]) => {
        const assessmentId = this._getActiveAssessmentId(route);
        const assessment = assessments.find(_assessment => _assessment.id === assessmentId);

        if(assessmentId !== '__noop__' && assessment && this._activeAssessment !== assessmentId){
          this._activeAssessment = assessmentId;
          this.set(assessment, 'UPDATE - FROM DB || ROUTE');
        }
      })
    ).subscribe();
  }

  private _getUrlSegments(route: NavigationEnd){
    return route.url.split('/');
  }

  private _getActiveAssessmentId(route: NavigationEnd){
    const urlSegments = this._getUrlSegments(route);
    const assessmentId = urlSegments.length >= 3 ? urlSegments[2] : '__noop__';
    return assessmentId;
  }
}
