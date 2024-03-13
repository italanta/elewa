import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { ConfirmPublishModalComponent } from '../confirm-publish-modal/confirm-publish-modal.component';

@Component({
  selector: 'italanta-apps-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
})
export class ConfirmDeleteModalComponent {
  bot: Bot;
  isDeleting: boolean;

  constructor(private _botsService: BotsStateService,
              public dialogRef: MatDialogRef<ConfirmPublishModalComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { bot: Bot} ) {
                this.bot = data.bot;
              }

  delete() { 
    this.isDeleting = true;
    this.bot.isPublished = true;
    this._botsService.deleteBot(this.bot)
      .subscribe(() => {
        this.isDeleting = false;
        this.dialogRef.close(true);
      });
  }
}
