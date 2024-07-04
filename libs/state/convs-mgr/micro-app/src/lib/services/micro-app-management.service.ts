import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { FrontendEnvironment } from '@app/elements/base/frontend-env';
import { InitMicroAppCmd, InitMicroAppResponse, MicroApp, MicroAppProgress } from '@app/model/convs-mgr/micro-app/base';


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

  // Initializes and returns new status
  private initMicroAppEndPoint = "initMicroApp";
  private progressEndpoint = PROGRESS_MICROAPP_ENDPOINT;
  private callBackHandler = 'appCallBack';

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

  // Send progress
  progress(appId: string, userId: string, orgId: string): Observable<any>{
    const data: MicroAppProgress  = {
      appId,
      endUserId: userId,
      orgId: orgId,

      // The payload to be sent to save current progress
      payload: null,
    }

    return this._http$.post<any>(this.progressEndpoint, data);
  }

    callBack(appId: string, userId: string, config: MicroApp) {
      // TODO: Implement a callback handler, that collects the data,
      //  depending on the app type and sends this data to the provided callbackUrl
      if(!config.callBackUrl) return;

      const URL = config.callBackUrl;

      const payload = {
        appId,
        endUserId: userId,
        orgId: config.orgId,

        // The payload to be sent to the callback url provided
        payload: null,
      }
  
      return this._http$.post(URL, {data: payload});
    }

  /** Mark the micro app as completed and redirect user to platform */
  completeApp(appId: string): Observable<any> {
    const url = `${this._env.microAppUrl}/${COMPLETE_MICROAPP_ENDPOINT}`;
    const payload: InitMicroAppCmd = { appId };

    return this._http$.post<any>(url, payload);
  }
}
