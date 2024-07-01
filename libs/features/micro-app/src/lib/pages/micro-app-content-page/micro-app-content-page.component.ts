import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';

import {  MicroAppStore } from '@app/state/convs-mgr/micro-app';


@Component({
  selector: 'app-micro-app-content-page',
  templateUrl: './micro-app-content-page.component.html',
  styleUrls: ['./micro-app-content-page.component.scss'],
})
export class MicroAppContentPageComponent implements OnInit 
{
  /** Object with comprehensive information on the microapp in progress */  
  status: MicroAppStatus;
  app: MicroAppStatus;

  private _sbS = new SubSink();

  constructor( private _microApp$$: MicroAppStore,
                private _router: Router 
  ){}

  ngOnInit(): void {
    // this.getAppStatus();

     // TODO: Use app status to resume the user's position if it's something
      // other than launched.
    //  STEP 1. Get app ID
    const app$ = this._microApp$$.get();

    this._sbS.sink = 
      app$.pipe(take(1)).subscribe(a => 
      {
         this.app = a;
        // this.isInitializing = false;

        if (a.status == MicroAppStatusTypes.Started){
          this._router.navigate(['main']);
        }

      });
  }
  
  /**
   *  Methd to fetch relevant data from app url
   *  @returns A comprehensive object defining the app state and details 
   */
  getAppStatus(){
    const storedStatus = localStorage.getItem('status');

    if(storedStatus) {
      this.status = JSON.parse(storedStatus) as MicroAppStatus;
    }else {
      console.log("No status set");
    }
  }
}
