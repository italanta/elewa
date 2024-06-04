import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { MicroAppConfig } from '@app/model/convs-mgr/micro-app/base';


@Injectable({
  providedIn: 'root'
})
//micro-app management service
export class MicroAppManagementService {

  constructor(private http: HttpClient,
    ) { }
  //How do we do http post requests? 
  private microAppEndPoint = 'cloudFucntionEndPoint'

  /** Building the required parameters of launching an app 
   *  On hitting the microapp block service, the app url will be appended to the configs
   *  Ideally, the url to link the app will then be returned
  */

//init micro-app
  initMicroApp(appId: string, userId: string, configs: MicroAppConfig): Observable<any>{
    const url = this.http.post(this.microAppEndPoint, { data: {appId, userId, configs} });
    return url
  }


  //progress status etc 


  // add orgId to url params / config
}
