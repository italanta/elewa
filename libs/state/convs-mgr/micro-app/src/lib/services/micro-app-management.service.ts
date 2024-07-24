import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { FrontendEnvironment } from '@app/elements/base/frontend-env';
import { InitMicroAppCmd, InitMicroAppResponse, MicroAppProgress, MicroAppSectionTypes, 
         MicroAppStatus, MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';


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
    return this._http$.post<{result: InitMicroAppResponse}>(initUrl, {data: payload})
              .pipe(map((resp)=> resp.result))
  }

/** Updating a user's progress when they are done with an assessment, on the redirect page */
progressCallBack(app?: MicroAppStatus, milestones?: MicroAppProgress) : Observable<MicroAppProgress> | undefined{
  if (!app || !app.config) return;

  const URL = `${this._env.microAppUrl}/${PROGRESS_MICROAPP_ENDPOINT}`;

  if (app.config.type === MicroAppTypes.Assessment && milestones) {

    return this._http$.post<MicroAppProgress>(URL, { data: milestones });
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
      return this._http$.post<MicroAppProgress>(URL, { data: appPayload });
    }
}

  /** Mark the micro app as completed and redirect user to platform */
  completeApp(appId: string): Observable<any> 
  {
    const url = `${this._env.microAppUrl}/${COMPLETE_MICROAPP_ENDPOINT}`;
    const payload: InitMicroAppCmd = { appId };

    return this._http$.post<any>(url, {data: payload});
  }
}
