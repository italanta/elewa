import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-create-class-modal',
  templateUrl: './create-class-modal.component.html',
  styleUrls: ['./create-class-modal.component.scss'],
})
export class CreateClassModalComponent {
  selectedClass: any;

  constructor(
    public dialogRef: MatDialogRef<CreateClassModalComponent>,
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  submitAction() {
    //  create class
    this.dialogRef.close();
  }
}
