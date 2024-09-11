import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable, forkJoin, of, switchMap, take } from 'rxjs';
import { SubSink } from 'subsink';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { Classroom, ClassroomUpdateEnum } from '@app/model/convs-mgr/classroom';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

@Component({
  selector: 'app-change-class',
  templateUrl: './change-class.component.html',
  styleUrls: ['./change-class.component.scss'],
})
export class ChangeClassComponent implements OnInit, OnDestroy {
  selectedClass: string;
  classrooms$: Observable<Classroom[]>;
  isUpdatingClass: boolean;
  classIds : string[] = [];

  private _sBs = new SubSink();

  constructor(
    private _classroom$: ClassroomService,
    private _enrolledUser$: EnrolledLearnersService,
    public dialogRef: MatDialogRef<ChangeClassComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { enrolledUsrs: EnrolledEndUser[]; mode: string }
  ) {}

  ngOnInit() {
    this.classrooms$ = this._classroom$.getAllClassrooms();
    this.data.enrolledUsrs.map((user) => {
      if(!this.classIds.includes(user.classId)){
        this.classIds.push(user.classId)
      }
    })
  }

  get enrolledUsers() {
    return this.data.enrolledUsrs;
  }

  getMode(enrolledUser: EnrolledEndUser) {
    return enrolledUser.classId
      ? ClassroomUpdateEnum.ChangeClass
      : ClassroomUpdateEnum.AddToGroup;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onChange(e: any) {
    this.selectedClass = e.value;
  }

  submitAction() {
    if (!this.selectedClass || !this.enrolledUsers || this.enrolledUsers.length === 0) return;
    this.isUpdatingClass = true;
  
    this._sBs.sink = this.classrooms$.pipe(
      switchMap(cls => {
        const classRoom = cls.find((classroom) => classroom.id === this.selectedClass);
  
        if (classRoom) {
          const userIds = this.enrolledUsers.map(user => user.id as string);
          classRoom.users = classRoom.users ? [...new Set([...classRoom.users, ...userIds])] : userIds;
          return this._classroom$.updateClassroom(classRoom);
        }

        return of(null)
      }),
      take(1)
    )
    .subscribe(() => this.updateLearners());
  }

  updateLearners() {
    const updatedLearners$ = this.enrolledUsers.map(user => {
      return this._enrolledUser$.updateLearnerClass$(user, this.selectedClass);
    });

    this._sBs.sink = forkJoin(updatedLearners$).subscribe(() => {
      this.isUpdatingClass = false;
      this.dialogRef.close();
    })
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
