import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

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
    private _activeSurvey$$: ActiveSurveyStore,
    private _aff:  AngularFireFunctions,
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
  sendSurvey(payload: any){
    const surveyReq = {
      channelId: "123034824233910",
      messageTemplateName:"hello_world",
      enrolledUserIds: payload.enrolledUserIds,
      surveyId: payload.surveyId
    }
    return this.sendCallFunction( surveyReq );
  }

  private sendCallFunction(data: any){
    const scheduleRef = this._aff.httpsCallable('sendSurvey');
    return scheduleRef(data);
  }
}
