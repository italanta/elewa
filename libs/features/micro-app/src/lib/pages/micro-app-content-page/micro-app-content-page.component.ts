import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MicroAppStatusService } from '../../services/micro-app-status.service';

import { MicroAppStatusTypes, MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';


@Component({
  selector: 'app-micro-app-content-page',
  templateUrl: './micro-app-content-page.component.html',
  styleUrls: ['./micro-app-content-page.component.scss'],
})
export class MicroAppContentPageComponent implements OnInit {
  //the url containing a user's platform details that we will redirect them to
  redirectUrl: string;
  //The url we will append a user's progress
  progressUrl: string
  //An observable of the status the app is in. It will be passed on to the content component for updating
  appStatusObs$: Observable<MicroAppStatusTypes>
  //The status of the app eg launched, start, completed etc
  appStatus: string;
  //the current section to display
  currSection: number

    constructor( private _microAppStatusServ: MicroAppStatusService,
      private _router: Router,
      private _route: ActivatedRoute
  ){}

  ngOnInit(): void {
      this.getAppStatus()
  }
  
  /**
   *  Methd to fetch relevant data from app url
   *  @returns A comprehensive object defining the app state and details 
   */
  getAppStatus(){
    const microAppStatus: MicroAppStatus = this._route.snapshot.queryParams['appStatus']
    if(microAppStatus){
      this.currSection = microAppStatus.currentSection;
      this.appStatusObs$ = this._microAppStatusServ.getMicroAppStatus();
    }

  }
}
