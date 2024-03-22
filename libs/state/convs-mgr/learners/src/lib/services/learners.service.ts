import * as _ from "lodash";

import { Injectable } from '@angular/core';

import { map, switchMap, of, combineLatest, concatMap, take } from 'rxjs';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { EndUserService } from '@app/state/convs-mgr/end-users';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { LearnersStore } from '../store/learners.store';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { Classroom } from "@app/model/convs-mgr/classroom";

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

                if(endUser.variables) {
                  user.name = endUser.variables['name'] || "";
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

  getLearnersFromClass(classId: string) {
    return this.getAllLearners$().pipe(map((learners)=> {
      learners = learners.map((learner)=> {
        learner.name = !learner.name ? "" : learner.name;
        return learner;
      } )
      return _.filter(learners, {classId: classId});
    }))
  }

  getSpecificLearner$(id: string) {
    return this._enrolledLearners$$.getOne(id);
  }

  deleteLearnerFromGroupById(learnerId: string) {
    return this.getSpecificLearner$(learnerId)
    .pipe(
      take(1),
      concatMap((learner) =>
      {
        if (learner) {
          learner.classId = "";
          return this.updateLearner$(learner);

        } else {
          return of({});
        }
      }));
  }

  deleteLearnerFromGroup(learner: EnrolledEndUser) {
    learner.classId = "";
    return this.updateLearner$(learner);
  }

  moveUserToGroup(user: EnrolledEndUser, destClass: Classroom) {
    user.classId = destClass.id as string;
    const updateLearner$ = this.updateLearner$(user);

    return updateLearner$;
  }

  addLearnerWithClassroom$(learner: EnrolledEndUser, classroom: Classroom) {
      return this._enrolledLearners$$.add(learner)
                .pipe(concatMap((enrolledLearner)=> {
                  const learnerId = enrolledLearner.id as string;
                  return this._classroomService.addUsersToClass([learnerId], classroom)}))
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

  updateLearnerClass$(learner: EnrolledEndUser, classId: string) {
    learner.classId = classId;
    return this.updateLearner$(learner);
  }

  getLearnerId$(platform: PlatformType, id: string ){
    return this._enrolledLearners$$.getLearnerByPlatfromId(platform, id)
  }
}
