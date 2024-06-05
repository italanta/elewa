import { Component, OnInit } from '@angular/core';

import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { MicroAppManagementService } from '@app/libs/state/convs-mgr/micro-app';

import { getPlatformURL } from '../../utils/create-platform-url.util';

@Component({
  selector: 'app-platform-redirect-page',
  templateUrl: './platform-redirect-page.component.html',
  styleUrls: ['./platform-redirect-page.component.scss'],
})
export class PlatformRedirectPageComponent implements OnInit
{
  status: MicroAppStatus;

  endUserId: string;

  COUNTDOWN = 10;

  constructor(private microAppService: MicroAppManagementService) {}

  ngOnInit(): void
  {
    this.getAppStatus();
    this.endUserId = this.status.endUserId;
    this.callBack();
    this.startCountdown();
  }

  /** Send data to a callback url */
  callBack() {
    this.microAppService.callBack(this.status.appId, this.status.endUserId, this.status.config)
                          ?.subscribe();
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      this.COUNTDOWN--;

      if (this.COUNTDOWN === 0) {
        clearInterval(interval);
        this.redirect();
      }
    }, 1000);
  }

  redirect(): void {
    // Redirect to the external URL
    // TODO: Add support for other platforms
    window.location.href = getPlatformURL(this.endUserId);
  }

  getAppStatus()
  {
    const storedStatus = localStorage.getItem('status');

    if (storedStatus) {
      this.status = JSON.parse(storedStatus) as MicroAppStatus;
    } else {
      console.log("No status set");
    }
  }
}
