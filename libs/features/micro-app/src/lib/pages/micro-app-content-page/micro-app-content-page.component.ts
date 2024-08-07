import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MicroAppStatus, MicroAppStatusTypes, MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';

import {  MicroAppStore } from '@app/state/convs-mgr/micro-app';


@Component({
  selector: 'app-micro-app-content-page',
  templateUrl: './micro-app-content-page.component.html',
  styleUrls: ['./micro-app-content-page.component.scss'],
})
export class MicroAppContentPageComponent implements OnInit 
{
  /** Object with comprehensive information on the microapp in progress */  
  app: MicroAppStatus;
  type: MicroAppTypes;

  private _sbS = new SubSink();

  constructor( private _microApp$$: MicroAppStore,
               private _router: Router, 
  ){}

  ngOnInit(): void 
  {
    // Methd to fetch relevant data from app url
    // returns A comprehensive object defining the app state and details 
    const app$ = this._microApp$$.get();

    this._sbS.sink = 
      app$.pipe(take(1)).subscribe(a => 
      {
         this.app = a;
         this.type = this.app.config.type;
        if (a.status == MicroAppStatusTypes.Completed){
          this._router.navigate(['redirect', this.app.id]);
        }
      });
    }
}
