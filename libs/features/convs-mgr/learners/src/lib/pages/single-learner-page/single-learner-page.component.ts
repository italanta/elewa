import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { switchMap } from 'rxjs';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-single-learner-page',
  templateUrl: './single-learner-page.component.html',
  styleUrls: ['./single-learner-page.component.scss'],
})
export class SingleLearnerPageComponent implements OnInit, OnDestroy {
  constructor(
    private _route: ActivatedRoute,
    private _elearners: EnrolledLearnersService
  ) {}

  private _sBS = new SubSink();
  currentLearner!: EnrolledEndUser;

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
        console.log(this.currentLearner)
        return this.currentLearner
      });
  }

  getBreadcrumbTitle() {
    return this.currentLearner.name || this.currentLearner.phoneNumber || this.currentLearner.id
  }

  ngOnDestroy() {
    this._sBS.unsubscribe();
  }
}
