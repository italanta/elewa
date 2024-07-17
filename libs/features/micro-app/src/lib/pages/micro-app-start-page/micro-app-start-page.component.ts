import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { MicroAppTypes, MicroApp, MicroAppStatus, MicroAppSectionTypes } from '@app/model/convs-mgr/micro-app/base';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments'
import { MicroAppAssessmentService, MicroAppStatusService, MicroAppStore } from '@app/state/convs-mgr/micro-app';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';


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

  assessment: Assessment;

  /** Tracking initialization (loading) */
  isInitializing = true;

  private _sbS = new SubSink();

  constructor(private _microApp$$: MicroAppStore,
              private _microAppStatusServ: MicroAppStatusService,
              private _assessmentService$: AssessmentService,
              private _microAppAssessServ: MicroAppAssessmentService,
              private _router: Router 
  ){}

  ngOnInit()
  {
    // STEP 1. Get app ID
     const app$ = this._microApp$$.get();
     this._sbS.sink = 
      app$.pipe(take(1)).subscribe(a => 
       {
        this.app = a;
        this.isInitializing = false;
        // TODO: If app state is already in completed here, what should we do?
       });
     this.getAppAssessment();   
  }

  /** Function to get the assessment to display 
   *  Fetches an assessment and checks if the block id matches the micro-app id
   *  Returns an assessment to be loaded
   */

  getAppAssessment()
  {
      //Question: Where is block data saved? we can get the assessment from the block data instead of fetching all assessments
    this._sbS.sink = this._assessmentService$.getAssessments$().subscribe((assessments) => {
      const publishedAssessments = assessments.filter((assessment) => assessment.isPublished);
      const renderedAssessment = publishedAssessments.find((appAssess)=> appAssess.id === this.app.id)

      if(renderedAssessment){
        const appAssessment: Assessment = {
          ...renderedAssessment, 
          channelId: this.app.config.channelId,
          pos: this.app.config.pos
        }
        this.assessment = appAssessment;
        this._microAppAssessServ.setAssessment(appAssessment)
      }
    })
  }

  /**
   * Function called when a user clicks the start button
   * Sets the microApp status to started and the section types to main section
   * Redirects the user to the main section route
  */
  handleStart() 
  {  
    // Update the micro-app content section prop
    //TODO: Check if this is necessary, can we only use the Launched, Started, Completed props?
    const updatedApp = { ...this.app, microAppSection: MicroAppSectionTypes.Main };
    this._microApp$$.next(updatedApp);

    this._router.navigate(['main', this.app.id]);
  }

  /** Unsubscribe from all subscriptions to prevent memory leaks */
  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }
}
