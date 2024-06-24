import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';

import { MicroAppStatusService } from '../../services/micro-app-status.service';

@Component({
  selector: 'app-micro-app-content-page',
  templateUrl: './micro-app-content-page.component.html',
  styleUrls: ['./micro-app-content-page.component.scss'],
})
export class MicroAppContentPageComponent implements OnInit {
    status: MicroAppStatus;

    constructor( private _microAppStatusServ: MicroAppStatusService,
      private _router: Router,
      private _route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.getAppStatus();


      // TODO: Use app status to resume the user's position if it's something
      //  other than launched.
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
