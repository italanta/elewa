import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { Classroom } from '@app/model/convs-mgr/classroom';

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

  private _sBs = new SubSink();

  constructor(
    private _classroom$: ClassroomService,
    private _enrolledUser$: EnrolledLearnersService,
    public dialogRef: MatDialogRef<ChangeClassComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { enrolledUsr: EnrolledEndUser; mode: string }
  ) {}

  ngOnInit() {
    this.classrooms$ = this._classroom$.getAllClassrooms();
  }

  get enrolledUser() {
    return this.data.enrolledUsr;
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
    if (!this.selectedClass) return;

    this.isUpdatingClass = true;
    this.enrolledUser.classId = this.selectedClass;
    this._sBs.sink = this._enrolledUser$
      .updateLearner$(this.enrolledUser)
      .subscribe(() => {
        this.isUpdatingClass = false;
        this.dialogRef.close();
      });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
