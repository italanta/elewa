import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { MicroAppTypes, MicroApp, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';
import { MicroAppStore } from '@app/state/convs-mgr/micro-app';
import { AssessmentConfiguration, RetryConfig } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';


@Component({
  selector: 'app-micro-app-start-page',
  templateUrl: './micro-app-start-page.component.html',
  styleUrls: ['./micro-app-start-page.component.scss']
})
export class MicroAppStartPageComponent implements OnInit, OnDestroy
{
  /** Comprehensive app data */
  app: MicroAppStatus;
  /** The microApp being launched */
  appType: MicroAppTypes;
  /** ID of the app */
  appId: string;
  /** Id of the end user interacting with the app */
  endUserId: string;
  /** Configuratins of a MicroApp */
  config: MicroApp;
  /** Tracking initialization (loading) */
  isInitializing = true;
  /** Assessment config object */
  assessmentConfigs: AssessmentConfiguration;
  /** Number of retries, if any */
  remainingTries: number;

  private _sbS = new SubSink();

  constructor(private _microApp$$: MicroAppStore,
              private _router: Router,
              private _assessmentStore$: AssessmentsStore,
  ) {}

  ngOnInit()
  {
    // STEP 1. Get app ID
     const app$ = this._microApp$$.get();
     this._sbS.sink = 
      app$.pipe(take(1)).subscribe(a => 
       {
        this.app = a;
        this.isInitializing = false;
        this.appType = a.config.type
        this.getAssessmentConfig()
        // Redirect the user back to whatsapp if they have already completed the app
        // Check if attempt is present
        if(this.app.status === MicroAppStatusTypes.Completed) {
          this._router.navigate(['redirect', this.app.id]); 
        }
        // TODO: If app state is already in completed here, what should we do?
       });
  }

    getAssessmentConfig(){
      this._assessmentStore$.getAssessmentByOrg(this.app.appId, this.app.config.orgId).subscribe((assessment) => {
        this.assessmentConfigs = assessment.configs

        const retryConfigs = this.assessmentConfigs.retryConfig as RetryConfig

        if(retryConfigs.onCount){
          this.remainingTries = retryConfigs.onCount
        }else{
          this.remainingTries = retryConfigs.onScore?.count as number;
        }
      })
    }
  /** Unsubscribe from all subscriptions to prevent memory leaks */
  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }
}
