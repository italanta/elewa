import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SubSink } from 'subsink';
import { switchMap } from 'rxjs';

import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-single-learner-page',
  templateUrl: './single-learner-page.component.html',
  styleUrls: ['./single-learner-page.component.scss'],
})
export class SingleLearnerPageComponent implements OnInit, OnDestroy {
  private _sBS = new SubSink();
  currentLearner!: EnrolledEndUser;

  constructor(
    private _route: ActivatedRoute,
    private _elearners: EnrolledLearnersService
  ) {}

  ngOnInit() {
    this._sBS.sink = this._route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id') as string;
          return this._elearners.getSpecificLearner$(id);
        })
      )
      .subscribe(learner => {
        this.currentLearner = learner as EnrolledEndUser
        return this.currentLearner
      });
  }

  getBreadcrumbTitle() {
    return (this.currentLearner) ? this.currentLearner?.name || this.currentLearner?.phoneNumber || this.currentLearner?.id : ''
  }

  ngOnDestroy() {
    this._sBS.unsubscribe();
  }
}
