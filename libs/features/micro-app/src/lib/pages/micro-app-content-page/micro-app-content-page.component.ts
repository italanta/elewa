import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MicroAppSectionTypes, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';

import {  MicroAppStore } from '@app/state/convs-mgr/micro-app';
import { Assessment, QuestionDisplayed } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppAssessmentService } from '../../services/handle-assessment.service';


@Component({
  selector: 'app-micro-app-content-page',
  templateUrl: './micro-app-content-page.component.html',
  styleUrls: ['./micro-app-content-page.component.scss'],
})
export class MicroAppContentPageComponent implements OnInit 
{
  /** Object with comprehensive information on the microapp in progress */  
  app: MicroAppStatus;
  /** An assessment updated by the start page */
  assessment: Assessment;

  private _sbS = new SubSink();

  constructor( private _microApp$$: MicroAppStore,
               private _microAppAssessServ: MicroAppAssessmentService,
               private _router: Router
  ){}

  ngOnInit(): void {
    // TODO: Use app status to resume the user's position if it's something
    // other than launched.

    this.getAppStatus();
    this._sbS.sink = this._microAppAssessServ.getAssessment().subscribe((assess) => {
      if (assess) this.assessment = assess;
     })
  }
  
  /**
   *  Methd to fetch relevant data from app url
   *  @returns A comprehensive object defining the app state and details 
   */
  getAppStatus(){
    console.log('assessment started')
    const app$ = this._microApp$$.get();

     this._sbS.sink = 
      app$.pipe(take(1)).subscribe(a => 
       {
        this.app = a;
        // TODO: If app state is already in completed here, what should we do?
       });
  }
}
