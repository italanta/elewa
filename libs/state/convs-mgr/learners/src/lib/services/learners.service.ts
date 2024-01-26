import { Injectable } from '@angular/core';

import { map, switchMap, of, combineLatest, concatMap } from 'rxjs';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { EndUserService } from '@app/state/convs-mgr/end-users';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { LearnersStore } from '../store/learners.store';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';

@Injectable({
  providedIn: 'root',
})
export class EnrolledLearnersService {
  constructor(
    private _enrolledLearners$$: LearnersStore,
    private _classroomService:ClassroomService, 
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

  addLearner$(learner: EnrolledEndUser, classId?: string) {

    if(classId) {
      return this._enrolledLearners$$.add(learner)
                .pipe(concatMap((enrolledLearner)=> {
                  const learnerId = enrolledLearner.id as string;
                  return this._classroomService.addUsersToClass([learnerId], classId)}))
    } else {
      return this._enrolledLearners$$.add(learner);
    }
  }

  removeLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.remove(learner);
  }

  updateLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.update(learner);
  }

  updateLearnerClass$(learner: EnrolledEndUser, classId: string) {
    learner.classId = classId;
    return this.updateLearner$(learner);
  }

  getLearnerId$(platform: PlatformType, id: string ){
    return this._enrolledLearners$$.getLearnerByPlatfromId(platform, id)
  }
}
