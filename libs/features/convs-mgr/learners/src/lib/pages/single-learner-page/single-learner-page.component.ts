import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SubSink } from 'subsink';
import { switchMap } from 'rxjs';

import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { EndUserService } from '@app/state/convs-mgr/end-users';
import { AssessmentCursor } from '@app/model/convs-mgr/conversations/admin/system';

@Component({
  selector: 'app-single-learner-page',
  templateUrl: './single-learner-page.component.html',
  styleUrls: ['./single-learner-page.component.scss'],
})
export class SingleLearnerPageComponent implements OnInit, OnDestroy {
  private _sBS = new SubSink();
  currentLearner!: EnrolledEndUser;
  endUserAssessments: AssessmentCursor[];

  constructor(
    private _route: ActivatedRoute,
    private _elearners: EnrolledLearnersService,
    private _endUserService: EndUserService,
  ) {}

  ngOnInit() {
      this.getCurrentLearner();
  }

  getCurrentLearner() {
    this._sBS.sink = this._route.paramMap
    .pipe(
      switchMap((params) => {
        const id = params.get('id') as string;
        return this._elearners.getSpecificLearner$(id);
      })
    )
    .subscribe(learner => {
      this.currentLearner = learner as EnrolledEndUser
      this.getUserAssessments();
    });
  }

  getUserAssessments() {
    if(this.currentLearner.whatsappUserId){
      this._sBS.sink = this._endUserService.getAssessmentStack(this.currentLearner.whatsappUserId).subscribe(ass=> {
        this.endUserAssessments = ass
      });
    }
    else{
      this.endUserAssessments = [];
    }
  }

  getBreadcrumbTitle() {
    return (this.currentLearner) ? this.currentLearner?.name || this.currentLearner?.phoneNumber || this.currentLearner?.id : ''
  }

  ngOnDestroy() {
    this._sBS.unsubscribe();
  }
}
