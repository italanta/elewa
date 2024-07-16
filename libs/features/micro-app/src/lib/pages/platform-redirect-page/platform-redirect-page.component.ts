import { Component, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { take, switchMap, of } from 'rxjs';

import { MicroAppSectionTypes, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';
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
    this.updateAppStatus();
    this.startCountdown();
  }

 /** Get and update an app's Status Object */
  updateAppStatus() {
    // STEP 1. Get app 
    const app$ = this._microApp$$.get();

    this._sbS.sink = app$.pipe(
      take(1),
      switchMap(stat => {
        this.status = stat;
        this.endUserId = this.status.endUserId;
        const currentStatus = {
          ...this.status,
          status: MicroAppStatusTypes.Completed,
          microAppSection: MicroAppSectionTypes.Redirect,
          finishedOn: new Date().getTime()
        } as MicroAppStatus;
        // Update the app status with completed status
        this._microApp$$.next(currentStatus);
        return of(currentStatus)
      }),
      // Send data to a callback url
      switchMap(() => {
        const callback$ = this.microAppService.progressCallBack(this.status.appId, this.status.endUserId, this.status.config);
        return callback$ ? callback$ : of(null);
      })
    ).subscribe();
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
