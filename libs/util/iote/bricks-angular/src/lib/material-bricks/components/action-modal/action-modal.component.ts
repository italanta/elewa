import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss']
})
export class ActionModalComponent
{

  title: string;
  message: string;
  closeText: string;
  confirmText: string;

  constructor(public dialogRef: MatDialogRef<ActionModalComponent>,
              @Inject(MAT_DIALOG_DATA) injectedData: { title: string, message: string, closeText: string, confirmText: string },)
  {
    this.title = injectedData.title;
    this.message = injectedData.message;
    this.closeText = injectedData.closeText;
    this.confirmText = injectedData.confirmText;
  }

  exitModal = () => this.dialogRef.close(false);

  confirm = () => this.dialogRef.close(true);

}