import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { MicroAppTypes, MicroApp, MicroAppStatusTypes, MicroAppStatus, MicroAppSectionTypes } from '@app/model/convs-mgr/micro-app/base';
import { MicroAppManagementService, MicroAppStatusService, MicroAppStore } from '@app/state/convs-mgr/micro-app';
import { Router } from '@angular/router';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppAssessmentService } from '../../services/handle-assessment.service';

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
  config: MicroApp;

  assessment: Assessment;

  isInitializing = true;

  constructor(private _microApp$$: MicroAppStore,
              private _microAppService: MicroAppManagementService,
              private _microAppStatusServ: MicroAppStatusService,
              private _assessmentService$: AssessmentService,
              private _microAppAssessServ: MicroAppAssessmentService,
              private _router: Router 
  )
               
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

        // TODO: If app state is already in completed here, what should we do?
       });
     this.getAppAssessment();   
  }

  /** Function to get the assessment to display 
   *  Fetches an assessment and checks if the block id matches the micro-app id
   *  Returns an assessment to be loaded
   */

  getAppAssessment(){
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
  handleStart() {
    const appStarted = MicroAppStatusTypes.Started;
    const mainSection = MicroAppSectionTypes.Main;
  
    this._microApp$$.next({
      appId: this.app.appId,
      endUserId: this.app.endUserId,
      config: this.app.config,
      startedOn: Date.now(),
      finishedOn: 0,
    } as unknown as MicroAppStatusTypes);
  
    this._microAppStatusServ.setMicroAppSections(mainSection);
    this._microAppStatusServ.setMicroAppStatus(appStarted);
  
    this._router.navigate(['main']);
  }

  /** Unsubscribe from all subscriptions to prevent memory leaks */
  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }
}
