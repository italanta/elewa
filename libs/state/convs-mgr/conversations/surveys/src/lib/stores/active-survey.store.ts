import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { Store } from "@iote/state";
import { combineLatest, filter, map, tap } from "rxjs";

import { Survey } from "@app/model/convs-mgr/conversations/surveys";
import { SurveysStore } from "./surveys.store";



@Injectable()
export class ActiveSurveyStore extends Store<Survey> {
  protected store = 'active-survey-store';
  _activeSurvey: string;

  constructor(private _surveys$$: SurveysStore,
              private _route: Router)
  {
    super(null as any);
    
    const surveys$ = this._surveys$$.get();

    const route$ = this._route.events.pipe(
      filter((_event) => _event instanceof NavigationEnd),
      map((_event) => _event as NavigationEnd)
    );

    this._sbS.sink = combineLatest([surveys$, route$]).subscribe(
      ([surveys, route]) => {
        const surveyId = this._getActiveSurveyId(route);
        const survey = surveys.find(_survey => _survey.id === surveyId);
          
        if(survey){
          this._activeSurvey = surveyId;
          this.set(survey, 'UPDATE - FROM DB || ROUTE');
        }
      });
  }

  private _getUrlSegments(route: NavigationEnd){
    return route.url.split('/');
  }

  private _getActiveSurveyId(route: NavigationEnd){
    const urlSegments = this._getUrlSegments(route);
    const surveyIdSegment = urlSegments.length >= 3 ? urlSegments[2] : '__noop__';
    // Select survey Id portion without query params
    return surveyIdSegment.split("?")[0];
  }

  override get = () => super.get().pipe(filter(val => val != null));

  update = (survey: Survey) => this._surveys$$.update(survey);
}
