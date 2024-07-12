import { Component, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';

import { MicroAppAssessmentQuestion, MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { MicroAppAssessmentService } from '../../../../../../state/convs-mgr/micro-app/src/lib/services/set-published-assessment.service';


@Component({
  selector: 'app-micro-app-content-page',
  templateUrl: './micro-app-content-page.component.html',
  styleUrls: ['./micro-app-content-page.component.scss'],
})
export class MicroAppContentPageComponent implements OnInit, OnDestroy
{
  /** Object with comprehensive information on the microapp in progress */  
  app: MicroAppStatus;
  /** An assessment updated by the start page */
  assessment: Assessment;
  /** List of Questions in an Assessment */
  assessmentQues: MicroAppAssessmentQuestion[];

  private _sbS = new SubSink();

  constructor( private _publishedAssessServ: MicroAppAssessmentService,
            
  ){}

  ngOnInit(): void 
  {
    // Getting an assessment that has been set by the start page
    this._sbS.sink = this._publishedAssessServ.getAssessment().subscribe(_assess => {
      if(_assess) this.assessment = _assess
    })
  }

  ngOnDestroy(): void 
  {
    this._sbS.unsubscribe()
  }
}
