

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, catchError, filter, map, of, switchMap, take } from 'rxjs';

import { FrontendEnvironment } from '@app/elements/base/frontend-env';
import { InitMicroAppCmd, InitMicroAppResponse, MicroApp, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';


const INIT_MICROAPP_ENDPOINT = 'initMicroApp';
const COMPLETE_MICROAPP_ENDPOINT = 'completeMicroApp';
const PROGRESS_MICROAPP_ENDPOINT = 'microAppProgress';
  
/**
 * Store which holds the micro-app state.
 */
@Injectable()
export class MicroAppStore 
{
  private _hasInit = false; 
  private _app: MicroAppStatus;
  private _app$$ = new BehaviorSubject<MicroAppStatus>(null as any as MicroAppStatus);

  constructor(route: ActivatedRoute,
              private _http$: HttpClient,
              private _router: Router,
              @Inject('ENVIRONMENT') private _env: FrontendEnvironment) 
  { 
    // Initialise subscription/listener
    route.params
      .pipe(
          // Get appId from route params
          map(p => p['id']),
          filter(appId => !!appId),
          take(1),
          // When appId param is available, load the micro-app
          switchMap((appId) => this._initMicroApp(appId)),
          catchError((e) => { console.error(`Critical error. Crash when loading app. App failed to load.`); throw e; } ))
        
      // Loading success. Resolve app
      .subscribe(appHolder => {
        if(!appHolder.success)
          console.error(`Critical error. Crash when loading app. App failed to load.`);

        this._hasInit = true;
        this._app = appHolder.app;

        this._app$$.next(this._app);
      });
  }

  /** Get the active app */
  get = () => this._app$$.pipe(filter(app => !!app));

  /**
   * Starts the micro-app execution.
   * 
   * TODO: Now in context of an assessment. We later probably need to subtype this experience. */
  start()
  {
    
  }

    // Send progress
    progress(appId: string, userId: string, orgId: string): Observable<any>{
      const data = {
        appId,
        endUserId: userId,
        orgId: orgId,

        // The payload to be sent to save current progress
        payload: null,
      }
  
      return this.aff.httpsCallable(this.progressEndpoint)(data);
    }

    callBack(appId: string, userId: string, config: MicroApp) {
      // TODO: Implement a callback handler, that collects the data,
      //  depending on the app type and sends this data to the provided callbackUrl
      if(!config.callBackUrl) return;

      const URL = config.callBackUrl;

      const payload = {
        appId,
        endUserId: userId,
        orgId: config.orgId,

        // The payload to be sent to the callback url provided
        payload: null,
      }
  
      return this._http$.post(URL, {data: payload});
    }

  /**
   * Call when app is completed
   */
  completeApp()
  { 
    const appId = this._app.appId;
    const curl = `${this._env.microAppUrl}/${COMPLETE_MICROAPP_ENDPOINT}`;

    const payload: InitMicroAppCmd = {
      appId
      // endUserId: userId,
      // orgId: configs.orgId
    }

    // TODO: On return, navigate to success
    // 
    return this._http$.post<InitMicroAppCmd>(curl, payload);
              // .pipe(map(r => r.));
  }

  /** After post is done and timeout screen completed, navigate back to Goomza via app callback. */
  navigateToAppCallback()
  {
    this._router.navigateByUrl(this._app.config.callBackUrl);
  }  

  /** Intialise the micro-app on app-load */
  private _initMicroApp(appId: string): Observable<InitMicroAppResponse>
  {
    const initUrl = `${this._env.microAppUrl}/${INIT_MICROAPP_ENDPOINT}`;

    const payload: InitMicroAppCmd = {
      appId
      // endUserId: userId,
      // orgId: configs.orgId
    }

    return this._http$.post<InitMicroAppResponse>(initUrl, payload);
              // .pipe(map(r => r.));
  }

}
