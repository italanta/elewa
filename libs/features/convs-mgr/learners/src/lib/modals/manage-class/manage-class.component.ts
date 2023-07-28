import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-manage-class',
  templateUrl: './manage-class.component.html',
  styleUrls: ['./manage-class.component.scss'],
})
export class ManageClassComponent {
  selectedClass: Classroom;

  constructor(
    public dialogRef: MatDialogRef<ManageClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { enrolledUser: EnrolledEndUser, mode: string }
  ) {}

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
    // set user to class
  }
}
