import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-update-user-class-modal',
  templateUrl: './update-user-class-modal.component.html',
  styleUrls: ['./update-user-class-modal.component.scss'],
})
export class UpdateUserClassModalComponent {
  selectedUser: any

  constructor(
    public dialogRef: MatDialogRef<UpdateUserClassModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedUser: EnrolledEndUser }
  ) {}

  onChange(e: any) {
    this.selectedUser = e.target.value;
  }

  onCancel() {
    this.dialogRef.close();
  }

  submitAction() {
    // perform form submit;
    // action: this.selectedAction,
    // users: this.selectedUsers

    this.dialogRef.close();
  }
}
