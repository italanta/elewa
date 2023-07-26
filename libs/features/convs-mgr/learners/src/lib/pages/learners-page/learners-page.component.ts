import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { SubSink } from 'subsink';
import { Observable, map, switchMap, of, combineLatest } from 'rxjs';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { EndUserService } from '@app/state/convs-mgr/end-users';

@Component({
  selector: 'app-learners-page',
  templateUrl: './learners-page.component.html',
  styleUrls: ['./learners-page.component.scss'],
})
export class LearnersPageComponent implements OnInit, OnDestroy {
  constructor(
    private _eLearners: EnrolledLearnersService,
    private _endUsers: EndUserService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  private _sBs = new SubSink();

  allLearners$: Observable<EnrolledEndUser[]>;
  allLearners: EnrolledEndUser[];
  learnersColumns = ['name', 'phone', 'course', 'class'];

  ngOnInit() {
    this.getCurrentCourseForUsers();
  }

  // TODO @LemmyMwaura: We now update the enrolled user's current milestone from the event brick so this method is redundant. 
  // TODO: to be removed after incremental adoption of the event brick(as a way to mark entry into a new milstone) on existing prod versions.
  getCurrentCourseForUsers() {
    this.allLearners$ = this._eLearners.getAllLearners$().pipe(
      switchMap((enrolledUsrs) => {
        if (enrolledUsrs.length === 0) {
          return of([]);
        }

        const endUsers = enrolledUsrs.map((user) => {
          if (!user.whatsappUserId) return of(user);

          return this._endUsers.getCourse(user.whatsappUserId).pipe(
            map((eventStack) => {
              if (eventStack && eventStack[0].isMilestone) {
                user.currentCourse = eventStack[0].name;
              }
              return user;
            })
          );
        });

        return combineLatest(endUsers);
      })
    );
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
