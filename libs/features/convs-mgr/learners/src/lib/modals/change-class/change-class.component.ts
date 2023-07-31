import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

@Component({
  selector: 'app-change-class',
  templateUrl: './change-class.component.html',
  styleUrls: ['./change-class.component.scss'],
})
export class ChangeClassComponent implements OnInit, OnDestroy {
  selectedClass: Classroom;
  classrooms$: Observable<Classroom[]>;

  private _sBs = new SubSink();

  constructor(
    private _classroom$: ClassroomService,
    private _enrolledUser$: EnrolledLearnersService,
    public dialogRef: MatDialogRef<ChangeClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { enrolledUser: EnrolledEndUser, mode: string }
  ) {}
  
  ngOnInit() {
    this.classrooms$ = this._classroom$.getAllClassrooms();
  }

  get enrolledUser() {
    return this.data.enrolledUser;
  }

  get mode() {
    return this.data.mode;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onChange(e: any) {
    this.selectedClass = e.target.value;
  }

  submitAction() {
    if (this.selectedClass.id) {
      this.enrolledUser.classId = this.selectedClass.id;

      this._sBs.sink = this._enrolledUser$.updateLearner$(this.enrolledUser).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
