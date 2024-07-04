import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, catchError, filter, map, switchMap, take,} from 'rxjs';

import { InitMicroAppResponse, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';

import { MicroAppManagementService } from '../services/micro-app-management.service';


/**
 * Store which holds the micro-app state.
 */
@Injectable()
export class MicroAppStore 
{
  private _hasInit = false;
  private _app: MicroAppStatus;
  private _app$$ = new BehaviorSubject<MicroAppStatus>( null as any as MicroAppStatus );

  constructor(
    route: ActivatedRoute,
    private _router: Router,
    private _microAppManagementService: MicroAppManagementService,
  ) {
    // Initialise subscription/listener
    route.params
      .pipe(
        // Get appId from route params
        map((p) => p['id']),
        filter((appId) => !!appId),
        take(1),
        // When appId param is available, load the micro-app
        switchMap((appId) => this._initMicroApp(appId)),
        catchError((e) => {
          console.error(
            `Critical error. Crash when loading app. App failed to load.`
          );
          throw e;
        })
      )

      // Loading success. Resolve app
      .subscribe((appHolder) => {
        if (!appHolder.success)
          console.error(
            `Critical error. Crash when loading app. App failed to load.`
          );

        this._hasInit = true;
        this._app = appHolder.app;

        this._app$$.next(this._app);
      });
  }

  /** Get the active app */
  get = () => this._app$$.pipe(filter((app) => !!app));

  /** 
   *  Starts the micro-app execution.
   *  Set the next status of the micro-app */
  next(status: MicroAppStatusTypes) {
    this._app = { ...this._app, status: status } as MicroAppStatus;
    this._app$$.next(this._app);
  }

  /**
   * Call when app is completed
   */
  completeApp() 
  {
    const appId = this._app.appId;
    const payload = { appId };

    this._microAppManagementService.completeApp(appId).subscribe({
      next: (res) => {
        console.log('App completed successfully', res);
        this.navigateToAppCallback();
      },
      error: (err) => {
        console.error('Error completing app', err);
      },
    });
  }

  /** After post is done and timeout screen completed, navigate back to Goomza via app callback. */
  navigateToAppCallback() 
  {
    this._router.navigateByUrl(this._app.config.callBackUrl);
  }

  /** Intialise the micro-app on app-load */
  private _initMicroApp(appId: string): Observable<InitMicroAppResponse> 
  {
    return this._microAppManagementService.initMicroApp(appId);
  }
}
