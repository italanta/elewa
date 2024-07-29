import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { MicroAppTypes, MicroAppStatusTypes, MicroAppSectionTypes } from "@app/model/convs-mgr/micro-app/base";
@Injectable({
  providedIn: 'root'
})

/** 
 * A service that sets the different statuses of a micro app as a user interacts with the app
 * 
 *  @type: A microApp can be an Assessment, A course or A game 
 *  @status : How is the user interacting with the app? 
 *  @section Which view should the user be seeing in the app? 
 */
export class MicroAppStatusService 
{
  microAppType: MicroAppTypes = MicroAppTypes.Assessment;

  /** 
   * Tracking the interactions of a user within the app
   * How the user is moving along the sections, from start, completed, abandoned etc
   */
  
  microAppStatusSource$ = new BehaviorSubject<MicroAppStatusTypes>(MicroAppStatusTypes.Launched)

  microAppStatusObs$$ = this.microAppStatusSource$.asObservable()

  /** 
   * At what section is the user first navigating to? 
   * By default, an app should start on the landing page
   */
  
  microAppSectionSource$ = new BehaviorSubject<MicroAppSectionTypes>(MicroAppSectionTypes.Start)

  microAppSectionObs$$ = this.microAppSectionSource$.asObservable()

  // LOGIC TO SET MICRO-APP TYPE

  setMicroApp(microAppType: MicroAppTypes){
    return this.microAppType = microAppType;
  }

  getMicroAppType(): MicroAppTypes {
    return this.microAppType;
  }

  //LOGIC TO SET MICROAPP STATUS

  setMicroAppStatus(microApStatus: MicroAppStatusTypes){
    return this.microAppStatusSource$.next(microApStatus)
  }

  getMicroAppStatus(): Observable<MicroAppStatusTypes>{
    return this.microAppStatusObs$$
  }

  //LOGIC TO NAVIGATE TO DIFFERENT SECTIONS

  setMicroAppSections(appSection: MicroAppSectionTypes){
    return this.microAppSectionSource$.next(appSection)
  }

  getAppSection(){
    return this.microAppSectionObs$$
  }
}