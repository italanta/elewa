
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { SubSink } from 'subsink';


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
    private _dialog: MatDialog,
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



  ngOnDestroy(): void
  {
    this._sBs.unsubscribe();
  }

  deleteClassroom()
  {
    this.classroomService.deleteClassroom(this.classRoom);
    this._dialog.closeAll();

  }
}