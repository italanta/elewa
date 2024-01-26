import { Injectable } from '@angular/core';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { ClassroomStore } from '../store/classroom.store';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Injectable({
  providedIn:  'root',
})
export class ClassroomService {
  constructor(private _classroom$$: ClassroomStore) {}

  getAllClassrooms() {
    return this._classroom$$.get();
  }

  addClassroom(classroom: Classroom) {
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

  addUsersToClass(users: string[], classId: string): void {
    this.getSpecificClassroom(classId).subscribe((cr: Classroom | undefined) => {
      if (cr) {
        if(cr.users) {
          cr.users.push(...users);
        } else {
          cr.users = [...users];
        }
        this._classroom$$.update(cr);
      }
    });
   }
}
