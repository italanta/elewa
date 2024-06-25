import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { MicroAppTypes, MicroAppConfig, MicroAppStatusTypes, MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { MicroAppStore } from '@app/state/convs-mgr/micro-app';

@Component({
  selector: 'app-micro-app-start-page',
  templateUrl: './micro-app-start-page.component.html',
  styleUrls: ['./micro-app-start-page.component.scss']
})
export class MicroAppStartPageComponent implements OnInit, OnDestroy
{
  private _sbS = new SubSink();

  app: MicroAppStatus;

  //The microApp being launched
  appType: MicroAppTypes;
  appId: string;
  endUserId: string;
  config: MicroAppConfig;

  isInitializing = true;

  constructor(private _microApp$$: MicroAppStore)
              // private _microAppService: MicroAppManagementService)
  {}

  ngOnInit()
  {
    // STEP 1. Get app ID
    const app$ = this._microApp$$.get();

    this._sbS.sink = 
      app$.pipe(take(1)).subscribe(a => 
      {
        this.app = a;
        this.isInitializing = false;

        // TODO: If app state is alreadyin completed here, what should we do?
      });
  }

  /**
   * Function called when a user clicks the start button
   * Sets the microApp status to started and the section types to main section
   * Redirects the user to the main section route
  */
  handleStart()
  {
    const appStarted = MicroAppStatusTypes.Started;

    this._sbS.sink =
      this._microApp$$.next(MicroAppStatusTypes.Started);

    this._microAppStatusServ.setMicroAppSections(mainSection)
    this._microAppStatusServ.setMicroAppStatus(appStarted)

    this._router.navigate(['main', ])
  }

  ngOnDestroy()
  {
    this.sub.unsubscribe();
  }
}
