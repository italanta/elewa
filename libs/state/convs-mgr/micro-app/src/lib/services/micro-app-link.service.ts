import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MicroAppBlock, MicroAppConfig } from '../../../../../../model/convs-mgr/stories/blocks/messaging/src/index';


@Injectable({
  providedIn: 'root'
})
//micro-app management service
export class MicroAppManagementService {

  constructor(private http: HttpClient) { }
  //How do we do http post requests? 
  private microAppEndPoint = 'cloudFucntionEndPoint'

  /** Building the required parameters of launching an app 
   *  On hitting the microapp block service, the app url will be appended to the configs
   *  Ideally, the url to link the app will then be returned
  */

//init micro-app
  initMicroApp(appId: string, userId: string, configs: MicroAppConfig): Observable<any>{
    return this.http.post(this.microAppEndPoint, { appId, userId, configs });
  }


  //progress status etc 


  // add orgId to url params / config
}
