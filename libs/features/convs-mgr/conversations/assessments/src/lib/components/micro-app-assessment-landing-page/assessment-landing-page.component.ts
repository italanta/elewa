import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assessment, AssessmentConfiguration, RetryConfig } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppSectionTypes, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';
import { MicroAppStore } from '@app/state/convs-mgr/micro-app';
import { AppViewService } from '../../services/content-view-mode.service';

@Component({
  selector: 'app-assessment-landing-page',
  templateUrl: './assessment-landing-page.component.html',
  styleUrl: './assessment-landing-page.component.scss',
})
export class AssessmentLandingPageComponent implements OnInit
{
  @Input() app: MicroAppStatus;
  assessment: Assessment;
  /** Defining retry parameters */
  retryState =  {
    completedAndHasRetry: false,
    completedAndNoRetry: false
  }
  assessmentConfigs: AssessmentConfiguration;
  /** Number of retries, if any */
  remainingTries: number;
  statusTypes = MicroAppStatusTypes
  constructor( private _assessmentStore$: AssessmentsStore,
               private _microApp$$: MicroAppStore,
               private _router: Router,
               private _pageViewService: AppViewService
  ){}

  ngOnInit ()
  {
    if(this.app){
      this.getAssessment();
    }
  }

  /** Fetch micro-app assessment and use config object to render either stepper form or all questions form
   *  Update a micro-app assessment with the channel and position
   */
  getAssessment(){
    this._assessmentStore$.getAssessmentByOrg(this.app.appId, this.app.config.orgId).subscribe(_assessment => {
      this.assessment = _assessment
      this.assessmentConfigs = this.assessment.configs

      const retryConfigs = this.assessmentConfigs.retryConfig as RetryConfig

      if(retryConfigs.onCount){
        this.remainingTries = retryConfigs.onCount
      }else{
        this.remainingTries = retryConfigs.onScore?.count as number;
      }
      this.setRetryState();
    })
  }
  
  setRetryState ()
  {
    if(this.app.status === MicroAppStatusTypes.Completed && this.remainingTries > 0){
      this.retryState.completedAndHasRetry = true;
    } else if (this.app.status === MicroAppStatusTypes.Completed && this.remainingTries === 0) {
      this.retryState.completedAndNoRetry = true;
    }
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
    const updatedApp = { ...this.app, 
                        microAppSection: MicroAppSectionTypes.Main,
                        status: MicroAppStatusTypes.Started,
                        startedOn: new Date().getTime() 
                      };
    this._microApp$$.next(updatedApp);
    this._router.navigate(['main', this.app.id]);
  }

  backToPlatform()
  {
    this._router.navigate(['redirect', this.app.id]); 
  }
}
