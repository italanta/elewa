import { Component, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { take } from 'rxjs';

import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { MicroAppManagementService, MicroAppStore } from '@app/state/convs-mgr/micro-app';

import { getPlatformURL } from '../../utils/create-platform-url.util';

@Component({
  selector: 'app-platform-redirect-page',
  templateUrl: './platform-redirect-page.component.html',
  styleUrls: ['./platform-redirect-page.component.scss'],
})
export class PlatformRedirectPageComponent implements OnInit
{
  status: MicroAppStatus;

  /** Phone number of a user */
  endUserId: string;
  /** countdown timer to redirect to platform*/
  COUNTDOWN = 10;

  private _sbS = new SubSink();

  constructor(private microAppService: MicroAppManagementService,
              private _microApp$$: MicroAppStore,
  ) {}

  ngOnInit(): void
  {
    this.getAppStatus();
    this.callBack();
    this.startCountdown();
  }

  /** Get an app's Status Object */
  getAppStatus()
  {
    // STEP 1. Get app 
    const app$ = this._microApp$$.get();

    this._sbS.sink = 
     app$.pipe(take(1)).subscribe(stat => 
      {
       this.status = stat;
       this.endUserId = this.status.endUserId;
      });
  }

  /** Send data to a callback url */
  callBack() 
  {
    this.microAppService.progressCallBack(this.status.appId, this.status.endUserId, this.status.config)
                          ?.subscribe();
  }

  /** Simulate a contdown before redirect
   *  Design specs
   */
  startCountdown(): void 
  {
    const interval = setInterval(() => {
      this.COUNTDOWN--;

      if (this.COUNTDOWN === 0) {
        clearInterval(interval);
        this.redirect();
      }
    }, 1000);
  }

  /** Redirect to the external URL */
  redirect(): void 
  { 
    // TODO: Add support for other platforms
    window.location.href = getPlatformURL(this.endUserId);
  }
}
