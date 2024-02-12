import { Injectable } from '@angular/core';

import { map, switchMap, of, combineLatest } from 'rxjs';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { EndUserService } from '@app/state/convs-mgr/end-users';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { LearnersStore } from '../store/learners.store';

@Injectable({
  providedIn: 'root',
})
export class EnrolledLearnersService {
  constructor(
    private _enrolledLearners$$: LearnersStore,
    private _endUsers: EndUserService
  ) {}

  getAllLearners$() {
    return this._enrolledLearners$$.get().pipe(
      switchMap((enrolledUsrs) => {
        if (enrolledUsrs.length === 0) return of([]);

        const endUsers = enrolledUsrs.map((user) => {
          if (!user.whatsappUserId) return of(user);

          /** Get's the current course for all user's with the WhatsappEndUser Id  */
          return this._endUsers.getSpecificUser(user.whatsappUserId).pipe(
            map((endUser) => {
              if (endUser) {
                user.currentCourse = endUser.currentStory as string || "";

                if(endUser.variables) {
                  user.name = endUser.variables['name'];
                }
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

  getLearnerId$(platform: PlatformType, id: string ){
    return this._enrolledLearners$$.getLearnerByPlatfromId(platform, id)
  }
}
