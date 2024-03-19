import * as _ from "lodash";

import { Injectable } from '@angular/core';

import { combineLatest, concatMap, of } from 'rxjs';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { Classroom } from '@app/model/convs-mgr/classroom';

import { ClassroomStore } from '../store/classroom.store';

@Injectable({
  providedIn:  'root',
})
export class ClassroomService {
  constructor(private _classroom$$: ClassroomStore) {}

  getAllClassrooms() {
    return this._classroom$$.get();
  }

  addClassroom(classroom: Classroom) {
    classroom.users = [];
    
    return this._classroom$$.add(classroom);
  }

  getSpecificClassroom(id: string) {
    return this._classroom$$.getOne(id);
  }

  deleteClassroom(classroom: Classroom) {
    return this._classroom$$.remove(classroom);
  }

  updateClassroom(classroom: Classroom) {
    return this._classroom$$.update(classroom);
  }

  moveUsersToClass(users: EnrolledEndUser[], current: Classroom, dest: Classroom) {
    const userIds = users.map(user => user.id as string);

    // Remove user from current classroom
    const filteredUsers = _.difference(current.users, userIds);

    current.users = filteredUsers || [];

    // Add user to new classroom
    if(dest.users) {
      dest.users?.push(...userIds);
    } else {
      dest.users = userIds;
    }

    const updateCurrentClas$ = this.updateClassroom(current);
    const updateNewClas$ = this.updateClassroom(dest);

    return combineLatest([updateCurrentClas$, updateNewClas$]);
  }

  addUsersToClass(users: string[], cr: Classroom) {
      if(cr.users) {
        cr.users.push(...users);
      } else {
        cr.users = [...users];
      }
      return this._classroom$$.update(cr);
    
   }
}
