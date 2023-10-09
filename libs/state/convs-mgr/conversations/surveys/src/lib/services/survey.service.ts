import { Injectable } from '@angular/core';

import { map, take } from 'rxjs';

import { Survey } from '@app/model/convs-mgr/conversations/surveys';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { SurveysStore } from '../stores/surveys.store';
import { ActiveSurveyStore } from '../stores/active-survey.store';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

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
  // Adjust data types once I know what the functions return
  sendSurvey(payload: any){
    const surveyReq = {
      channelId: "123034824233910",
      enrolledUserIds: ["dd698779-ecd0-4f90-957"],
      surveyId: payload.surveyId,
      // messageTemplateName:"hello_world"
    }
    return this.sendCallFunction( surveyReq );
  }

  private sendCallFunction(data: any){
    const scheduleRef = this._aff.httpsCallable('sendSurvey');
    return scheduleRef(data);
  }
}
