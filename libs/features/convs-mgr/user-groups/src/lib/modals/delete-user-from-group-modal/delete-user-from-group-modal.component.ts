import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest } from 'rxjs';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

@Component({
  selector: 'app-delete-user-from-group-modal',
  templateUrl: './delete-user-from-group-modal.component.html',
  styleUrls: ['./delete-user-from-group-modal.component.scss'],
})
export class DeleteUserFromGroupModalComponent {

  constructor(
    private _dialog: MatDialogRef<DeleteUserFromGroupModalComponent>,
    private classroomService: ClassroomService,
    private _learnerService: EnrolledLearnersService,
    @Inject(MAT_DIALOG_DATA) public data: { classroom: Classroom, learner: EnrolledEndUser}
  ) { }

  deleteUserFromGroup()
  {
    const learner = this.data.learner;
    const classroom = this.data.classroom;

    const learnerUpdate$ = this._learnerService.deleteLearnerFromGroup(learner);
    classroom.users = classroom.users?.filter((id) => id !== learner.id);

    const classroomUpdate$ = this.classroomService.updateClassroom(classroom);

    combineLatest([learnerUpdate$, classroomUpdate$]).subscribe(()=> this._dialog.close());
  }
}
