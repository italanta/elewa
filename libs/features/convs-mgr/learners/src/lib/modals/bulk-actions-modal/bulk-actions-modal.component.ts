import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-bulk-actions-modal',
  templateUrl: './bulk-actions-modal.component.html',
  styleUrls: ['./bulk-actions-modal.component.scss'],
})
export class BulkActionsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<BulkActionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedUsers: EnrolledEndUser[] }
  ) {}

  get selectedUsers() {
    return this.data.selectedUsers.length;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
