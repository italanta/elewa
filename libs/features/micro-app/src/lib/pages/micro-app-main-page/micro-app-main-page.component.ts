import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MicroAppTypes, MicroAppSectionTypes, MicroAppConfig, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';

import { MicroAppStatusService } from '../../services/micro-app-status.service';

@Component({
  selector: 'app-micro-app-main-page',
  templateUrl: './micro-app-main-page.component.html',
  styleUrls: ['./micro-app-main-page.component.scss']
})
export class MicroAppMainPageComponent implements OnInit {
  //The microApp being launched
  appType = MicroAppTypes;
  //Types of MicroApps that we have
  appTypes: Observable<MicroAppTypes>
  appSection: MicroAppSectionTypes

  constructor( private _microAppStatusServ: MicroAppStatusService,
    private _router: Router,
    private _route: ActivatedRoute
  ){}

  ngOnInit(){
    this.getParamData();
  }

  /**
  * Checks the data in the query params and renders the micro app depending on available data
  */
  getParamData(){
    const microAppConfig: MicroAppConfig = this._route.snapshot.queryParams['config']
    const microAppType = microAppConfig?.type
    if(microAppType){
      this.appTypes = this._microAppStatusServ.getMicroAppType()
      this._microAppStatusServ.getAppSection().subscribe(_val => {this.appSection = _val})
    }
  }

  /**
   * Function called when a user clicks the start button
   * Sets the microApp status to started and the section types to main section
   * Redirects the user to the main section route
  */
  handleStart(){
    const mainSection = MicroAppSectionTypes.Main
    const appStarted = MicroAppStatusTypes.Started
    this._microAppStatusServ.setMicroAppSections(mainSection)
    this._microAppStatusServ.setMicroAppStatus(appStarted)
    this._router.navigate(['main'])
 
    console.log('started')
  }
}
