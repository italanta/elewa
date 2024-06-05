import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { InitMicroAppCmd, InitMicroAppResponse, MicroAppConfig } from '@app/model/convs-mgr/micro-app/base';
import { AngularFireFunctions } from '@angular/fire/compat/functions';


@Injectable({
  providedIn: 'root'
})
//micro-app management service
export class MicroAppManagementService {

  constructor(private aff: AngularFireFunctions, private http: HttpClient) { }
  // Initializes and returns new status
  private initMicroAppEndPoint = 'initMicroApp';
  private progressEndpoint = 'microAppProgress';

  /** Building the required parameters of launching an app 
   *  On hitting the microapp block service, the app url will be appended to the configs
   *  Ideally, the url to link the app will then be returned
  */

  // Init micro-app
  initMicroApp(appId: string, userId: string, configs: MicroAppConfig): Observable<InitMicroAppResponse>{
    const payload: InitMicroAppCmd = {
      appId,
      endUserId: userId,
      orgId: configs.orgId
    }

    return this.aff.httpsCallable(this.initMicroAppEndPoint)(payload);
  }

    // Send progress
    progress(appId: string, userId: string, orgId: string): Observable<any>{
      const data = {
        appId,
        endUserId: userId,
        orgId: orgId,

        // The payload to be sent to save current progress
        payload: null,
      }
  
      return this.aff.httpsCallable(this.progressEndpoint)(data);
    }

    callBack(appId: string, userId: string, config: MicroAppConfig) {
      if(!config.callBackUrl) return;

      const URL = config.callBackUrl;

      const payload = {
        appId,
        endUserId: userId,
        orgId: config.orgId,

        // The payload to be sent to the callback url provided
        payload: null,
      }
  
      return this.http.post(URL, {data: payload});
    }
}
