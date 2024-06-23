import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { ConfirmPublishModalComponent } from '../confirm-publish-modal/confirm-publish-modal.component';

@Component({
  selector: 'italanta-apps-confirm-archive-modal',
  templateUrl: './confirm-archive-modal.component.html',
  styleUrls: ['./confirm-archive-modal.component.scss'],
})
export class ConfirmArchiveModalComponent {
  bot: Bot;
  isArchiving: boolean;

  constructor(private _botsService: BotsStateService,
              public dialogRef: MatDialogRef<ConfirmPublishModalComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { bot: Bot} ) {
                this.bot = data.bot;
              }

  archive() { 
    this.isArchiving = true;
    this._botsService.archiveBot(this.bot)
      .subscribe(() => {
        this.isArchiving = false;
        this.dialogRef.close(true);
      });
  }
}
