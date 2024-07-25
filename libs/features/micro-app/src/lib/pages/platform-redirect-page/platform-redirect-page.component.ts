import { Component, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { take, switchMap } from 'rxjs';

import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { MicroAppManagementService, MicroAppStore } from '@app/state/convs-mgr/micro-app';

import { getPlatformURL } from '../../utils/create-platform-url.util';

@Component({
  selector: 'app-platform-redirect-page',
  templateUrl: './platform-redirect-page.component.html',
  styleUrls: ['./platform-redirect-page.component.scss'],
})
export class PlatformRedirectPageComponent implements OnInit, OnDestroy
{
  /** Current app status */
  appStatus: MicroAppStatus;

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
      switchMap((appStatus) => {
        this.appStatus = appStatus;
        this.endUserId = appStatus.endUserId;

        return this.microAppService.completeApp(this.appStatus.id as string);
      })
    ).subscribe(()=> this.redirect());
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

  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }

  /** Redirect to the external URL */
  redirect(): void 
  { 
    // TODO: Add support for other platforms
    window.location.href = getPlatformURL(this.appStatus.config.channel);
  }
}
