import { Injectable } from '@angular/core';

import { map, take } from 'rxjs';

import { Survey } from '@app/model/convs-mgr/conversations/surveys';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { SurveysStore } from '../stores/surveys.store';
import { ActiveSurveyStore } from '../stores/active-survey.store';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(
    private _surveys$$: SurveysStore,
    private _orgId$$: ActiveOrgStore,
    private _activeSurvey$$: ActiveSurveyStore
  ) {}

  getActiveSurvey$() {
    return this._activeSurvey$$.get();
  }

  getSurveys$() {
    return this._surveys$$.get();
  }

  addSurvey$(survey: Survey) {
    return this._surveys$$.createSurvey(survey);
  }

  updateSurvey$(survey: Survey) {
    return this._surveys$$.update(survey);
  }

  deleteSurvey$(oldSurvey: Survey) {
    return this._surveys$$.remove(oldSurvey)
  }

  getSurveyOrg$ = () => this._orgId$$.get().pipe(take(1), map((_org) => _org.id));

  getSurvey$(surveyId: string) {
    return this._surveys$$.getOne(surveyId);
  }
}
