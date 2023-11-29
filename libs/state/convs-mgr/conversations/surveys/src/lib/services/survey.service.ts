import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, concatMap, map, of, switchMap, take } from 'rxjs';

import { Survey } from '@app/model/convs-mgr/conversations/surveys';
import { StartSurveyReq, StartSurveyResponse } from '@app/private/model/convs-mgr/micro-apps/surveys'

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { SurveysStore } from '../stores/surveys.store';
import { ActiveSurveyStore } from '../stores/active-survey.store';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(
    private _surveys$$: SurveysStore,
    private _orgId$$: ActiveOrgStore,
    private _activeSurvey$$: ActiveSurveyStore,
    private _aff:  AngularFireFunctions,
    private _channelService: CommunicationChannelService
  ) {}

  getActiveSurvey$() {
    return this._activeSurvey$$.get();
  }

  getSurveys$() {
    return this._surveys$$.get();
  }

  addSurvey$(survey: Survey) {
    return this._surveys$$.add(survey);
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

  sendSurvey(payload: any, enrolledUsers: EnrolledEndUser[]){
    const channelId = payload.channelId
    const surveyReq: StartSurveyReq = {
      channelId: channelId,
      messageTemplateId:payload.id,
      endUserIds: [],
      surveyId: payload.surveyId
    }

    return this._channelService.getSpecificChannel(channelId)
        .pipe(
            switchMap((channel)=> {
                if(channel) {
                  const endUserIds = enrolledUsers.map((user)=> {
                    if(user.platformDetails){
                      return user.platformDetails[channel.type].endUserId;
                    } else {
                      return "";
                    }
                  });

                  surveyReq.endUserIds = endUserIds;

                  return this.sendCallFunction(surveyReq);
                } else {
                  return of(null);
                }
            }))
  }

  private sendCallFunction(data: StartSurveyReq): Observable<StartSurveyResponse>{
    const scheduleRef = this._aff.httpsCallable('sendSurvey');
    return scheduleRef(data);
  }
}
