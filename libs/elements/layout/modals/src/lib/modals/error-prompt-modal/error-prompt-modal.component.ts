import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-prompt-modal',
  templateUrl: './error-prompt-modal.component.html',
  styleUrls: ['./error-prompt-modal.component.scss'],
})
export class ErrorPromptModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorPromptModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
