import { Injectable } from '@angular/core';

import { map, switchMap, of, combineLatest } from 'rxjs';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { EndUserService } from '@app/state/convs-mgr/end-users';

import { LearnersStore } from '../store/learners.store';

@Injectable({
  providedIn: 'root',
})
export class EnrolledLearnersService {
  constructor(
    private _enrolledLearners$$: LearnersStore,
    private _endUsers: EndUserService
  ) {}

  // TODO @LemmyMwaura: We now update the enrolled user's current milestone from the event brick so everything inside the pipe operator is redundant.
  // TODO: to be removed after incremental adoption of the event brick(as a way to mark entry into a new milestone) on existing prod versions.
  getAllLearners$() {
    return this._enrolledLearners$$.get().pipe(
      switchMap((enrolledUsrs) => {
        if (enrolledUsrs.length === 0) return of([]);

        const endUsers = enrolledUsrs.map((user) => {
          if (!user.whatsappUserId) return of(user);

          /** Get's the current course for all user's with the WhatsappEndUser Id  */
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

  getSpecificLearner$(id: string) {
    return this._enrolledLearners$$.getOne(id);
  }

  addLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.add(learner);
  }

  removeLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.remove(learner);
  }

  updateLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.update(learner);
  }
}
