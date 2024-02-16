import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';

@Component({
  selector: 'app-delete-user-group-modal',
  templateUrl: './delete-user-group-modal.component.html',
  styleUrls: ['./delete-user-group-modal.component.scss'],
})
export class DeleteUserGroupModalComponent implements OnInit, OnDestroy
{
  private _sBs = new SubSink();

  classRoom: any;
  classRoomId = '';

  constructor(
    private _dialog: MatDialogRef<DeleteUserGroupModalComponent>,
    private classroomService: ClassroomService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; }
  )
  {
    this.classRoomId = this.data.id;
  }
  
  ngOnInit(): void
  {
    this.getUserGroup();

  }
  getUserGroup()
  {
    this.classroomService.getSpecificClassroom(this.classRoomId).subscribe(
      (classRoom) =>
      {
        this.classRoom = classRoom;
      }
    );
  }

  deleteClassroom()
  {
    this.classroomService.deleteClassroom(this.classRoom)
          .subscribe(()=> this._dialog.close());
  }

  ngOnDestroy(): void
  {
    this._sBs.unsubscribe();
  }
}