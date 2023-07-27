import { Injectable } from '@angular/core';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { ClassroomStore } from '../store/classroom.store';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  constructor(private _classroom$$: ClassroomStore) {}

  getAllClassrooms() {
    return this._classroom$$.get();
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
}
