import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { NewStoryService } from '../../services/new-story.service';
import { BotElementType } from '../../model/all-elements.type';
import { DeleteElementsEnum } from '../../model/delete-element.enum';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
})
export class ConfirmDeleteModalComponent {
  isDeleting: boolean;

  element!: BotElementType;
  mode: DeleteElementsEnum;
  parentElement!: BotElementType;

  private _sBs = new SubSink();

  constructor(private _botsService: BotsStateService,
    private _addStory$: NewStoryService,
    private _botServ$: BotsStateService,
    private _botModServ$: BotModulesStateService,
    private _dialog: DialogRef,
    private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<ConfirmDeleteModalComponent>, 
              @Inject(MAT_DIALOG_DATA)     public data: {
                mode: DeleteElementsEnum;
                element: BotElementType;
                parentElement: BotElementType;
              } ) {
                this.mode = this.data.mode;
                this.element = this.data.element;
                this.parentElement = this.data.parentElement;
              }

  delete() { 
    this._sBs.sink = this.getElementToDelete();
  }


  getElementToDelete() {
    switch (this.mode) {
      case DeleteElementsEnum.Bot:
        return this._botServ$
          .deleteBot(this.element as Bot)
          .subscribe((response) => {
            if(response.status === 200) {
              this.snackBar.open("Delete Bot successful","Dismiss",{
                duration: 3000
              });
            } else {
              this.snackBar.open("Delete Bot failed","Dismiss",{
                duration: 3000
              });
            }
            this._dialog.close()
          });
      case DeleteElementsEnum.Story:
        return this._addStory$
          .removeStory(this.element as Story, this.parentElement as BotModule)
          .subscribe(() => this._dialog.close());
      case DeleteElementsEnum.BotModule:
        return this._botModServ$
          .deleteBotModules(this.element as BotModule)
          .subscribe(() => this._dialog.close());
    }
  }
}
