import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

@Component({
  selector: 'italanta-apps-confirm-publish-modal',
  templateUrl: './confirm-publish-modal.component.html',
  styleUrls: ['./confirm-publish-modal.component.scss'],
})
export class ConfirmPublishModalComponent {

  bot: Bot;
  isPublishing: boolean;
  isUploading: boolean;

  constructor(private _botsService: BotsStateService,
              public dialogRef: MatDialogRef<ConfirmPublishModalComponent>, 
              private _snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: { bot: Bot} ) 
              {
                this.bot = data.bot;
              }

  publish() { 
    this.isPublishing = true;
    this.bot.isPublished = true;
    this.bot.publishedOn = new Date();
    this._botsService.updateBot(this.bot)
      .subscribe(() => {
        this.isPublishing = false;
        this.dialogRef.close(true);
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
