import * as _ from "lodash";

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { map } from 'rxjs';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

@Component({
  selector: 'app-move-users-to-group-modal',
  templateUrl: './move-users-to-group-modal.component.html',
  styleUrls: ['./move-users-to-group-modal.component.scss'],
})
export class MoveUsersToGroupModalComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  isMovingUsers: boolean;
  moveUsersForm:FormGroup;
  classrooms: Classroom[];
  currentClass: Classroom;

  constructor(
    private _fb:FormBuilder,
    private _dialog:MatDialog,
    private _classroomService: ClassroomService,
    private _learnerService: EnrolledLearnersService,
    @Inject(MAT_DIALOG_DATA) public data: { currentClass: Classroom, users: EnrolledEndUser[]}
  ) {
    this.currentClass = this.data.currentClass;
  }

  ngOnInit() {
    this.loadClassrooms();
    this.buildForm();
  }

  loadClassrooms() {
    this._sBs.sink = this._classroomService.getAllClassrooms()
                      .pipe(map((cls) => cls.filter((cr)=> cr.id !== this.currentClass.id)))
                        .subscribe((classrooms)=> this.classrooms = classrooms);
  }

  buildForm(){
    this.moveUsersForm = this._fb.group({
      destClass:['', Validators.required]
    })
  }
  
  submitForm() {
    this.moveSelectedUsers();

    this._dialog.closeAll();
  }

  moveSelectedUsers() {
    this.isMovingUsers = true;

    const destClassId = this.moveUsersForm.value.destClass;
    const destClass = this.classrooms.filter((cr)=> cr.id === destClassId);

    this.data.users.forEach((user)=> 
        this.moveUserToGroup(user, destClass[0]));

    const newDest = _.cloneDeep(destClass[0]);
    const newCurrent = _.cloneDeep(this.currentClass);

    this._classroomService.moveUsersToClass(this.data.users, newCurrent, newDest)
            .subscribe(() => this.isMovingUsers = false);
  }
  
  moveUserToGroup(user: EnrolledEndUser, destClass: Classroom) {
    this._learnerService
        .moveUserToGroup(user, destClass)
          .subscribe()
  }
  

  ngOnDestroy(): void {
      this._sBs.unsubscribe();
  }
}
