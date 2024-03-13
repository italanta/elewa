import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';

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
              private _fileStorageService: FileStorageService,
              public dialogRef: MatDialogRef<ConfirmPublishModalComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { bot: Bot} ) 
              {
                this.bot = data.bot;
              }

  publish() { 
    this.isPublishing = true;
    this.bot.isPublished = true;
    this._botsService.updateBot(this.bot)
      .subscribe(() => {
        this.isPublishing = false;
        this.dialogRef.close(true);
      });

    // Upload Media to platform server e.g. whatsapp server
    //  Solves delays in sending images vs text  
    if(this.bot.linkedChannel) {
      this.isUploading = true;
      this._fileStorageService.uploadMediaToPlatform(this.bot.linkedChannel).subscribe((result)=> {
        this.isUploading = false;
        if(result) {
          // Show success
        } else {
          // Show failure due to linked channel
        }
      })
    }
  }
}
