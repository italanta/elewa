import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { FrontendEnvironment } from '@app/elements/base/frontend-env';
import { InitMicroAppCmd, InitMicroAppResponse, MicroAppProgress, MicroAppSectionTypes, 
         MicroAppStatus, MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentProgressUpdate } from '@app/model/convs-mgr/micro-app/assessments';


const INIT_MICROAPP_ENDPOINT = 'initMicroApp';
const PROGRESS_MICROAPP_ENDPOINT = 'microAppProgress';
const COMPLETE_MICROAPP_ENDPOINT = 'completeMicroApp';

@Injectable({
  providedIn: 'root'
})

/** State service to communicate with CLM Microapps */
export class MicroAppManagementService 
{ 
  constructor(private _http$: HttpClient,
              @Inject('ENVIRONMENT') private _env: FrontendEnvironment) 
  { }

  /** Building the required parameters of launching an app 
   *  On hitting the microapp block service, the app url will be appended to the configs
   *  Ideally, the url to link the app will then be returned
  */
  initMicroApp(appId: string): Observable<InitMicroAppResponse>
  {
    const initUrl = `${this._env.microAppUrl}/${INIT_MICROAPP_ENDPOINT}`
    const payload: InitMicroAppCmd = {
      appId
    }

    return this._http$.post<InitMicroAppResponse>(initUrl, payload);
  }

/** Updating a user's progress when they are done with an assessment, on the redirect page */
progressCallBack(app?: MicroAppStatus, milestones?: AssessmentProgressUpdate) {
  if (!app || !app.config || !app.config.callBackUrl) return;

  const URL = app.config.callBackUrl;

  if (app.config.type === MicroAppTypes.Assessment && milestones) {
    const assessmentPayload: AssessmentProgressUpdate = {
      appId: milestones.appId,
      endUserId: milestones.endUserId,
      orgId: milestones.orgId,
      questionResponses: milestones.questionResponses,
      assessmentDetails: {
        maxScore: milestones.assessmentDetails.maxScore,
        questionCount: milestones.assessmentDetails.questionCount
      },
      type: MicroAppTypes.Assessment,
      timeSpent: milestones.timeSpent
    };
    return this._http$.post(URL, { data: assessmentPayload });
  } else {
      const appPayload: MicroAppProgress = {
        appId: app.appId,
        endUserId: app.endUserId,
        orgId: app.config.orgId,
        type: app.config.type,
        appMilestones: {
          appSection: app.microAppSection ? app.microAppSection : MicroAppSectionTypes.Start,
          timeSpent: (app.finishedOn && app.startedOn) ? (app.finishedOn - app.startedOn) : undefined
        }
      };
      return this._http$.post(URL, { data: appPayload });
    }
}

  /** Mark the micro app as completed and redirect user to platform */
  completeApp(appId: string): Observable<any> 
  {
    const url = `${this._env.microAppUrl}/${COMPLETE_MICROAPP_ENDPOINT}`;
    const payload: InitMicroAppCmd = { appId };

    return this._http$.post<any>(url, payload);
  }
}
