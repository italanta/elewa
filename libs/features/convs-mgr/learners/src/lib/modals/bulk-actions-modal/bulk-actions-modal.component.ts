import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-bulk-actions-modal',
  templateUrl: './bulk-actions-modal.component.html',
  styleUrls: ['./bulk-actions-modal.component.scss'],
})
export class BulkActionsModalComponent {
  selectedAction: string;

  constructor(
    public dialogRef: MatDialogRef<BulkActionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedUsers: EnrolledEndUser[] }
  ) {}

  get selectedUsers() {
    return this.data.selectedUsers;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onChange(e: any) {
    this.selectedAction = e.target.value;
  }

  submitAction() {
    // perform form submit;
    // action: this.selectedAction,
    // users: this.selectedUsers
    
    this.dialogRef.close();
  }
}
