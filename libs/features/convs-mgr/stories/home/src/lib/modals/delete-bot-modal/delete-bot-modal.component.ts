import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

import { SubSink } from 'subsink';

import { Story } from '@app/model/convs-mgr/stories/main';
import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { NewStoryService } from '../../services/new-story.service';
import { DeleteElementsEnum } from '../../model/delete-element.enum';
import { BotElementType } from '../../model/all-elements.type';

@Component({
  selector: 'convl-italanta-apps-delete-bot-modal',
  templateUrl: './delete-bot-modal.component.html',
  styleUrls: ['./delete-bot-modal.component.scss'],
})
export class DeleteBotModalComponent implements OnInit, OnDestroy {
  element!: BotElementType;
  mode: DeleteElementsEnum;
  parentElement!: BotElementType;

  private _sBs = new SubSink();

  constructor(
    private _addStory$: NewStoryService,
    private _botServ$: BotsStateService,
    private _botModServ$: BotModulesStateService,
    private _dialog: DialogRef,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef for manual change detection

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: DeleteElementsEnum;
      element: BotElementType;
      parentElement: BotElementType;
    }
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode;
    this.element = this.data.element;
    this.parentElement = this.data.parentElement;
  }

  getElementToDelete() {
    switch (this.mode) {
      case DeleteElementsEnum.Bot:
        return this._botServ$.deleteBot(this.element as Bot).subscribe(
          () => {
            console.log('Bot deleted successfully');
            this.closeModal();
          },
          (error) => {
            console.error('Error deleting bot:', error);
            this.closeModal(); // Close the modal even on error
          }
        );
      case DeleteElementsEnum.Story:
        return this._addStory$
          .removeStory(this.element as Story, this.parentElement as BotModule)
          .subscribe(
            () => {
              console.log('Story removed successfully');
              this.closeModal();
            },
            (error) => {
              console.error('Error removing story:', error);
              this.closeModal(); // Close the modal even on error
            }
          );
      case DeleteElementsEnum.BotModule:
        return this._botModServ$
          .deleteBotModules(this.element as BotModule)
          .subscribe(
            () => {
              console.log('Bot module deleted successfully');
              this.closeModal();
            },
            (error) => {
              console.error('Error deleting bot module:', error);
              this.closeModal(); // Close the modal even on error
            }
          );
    }
  }

  closeModal() {
    console.log('Closing modal');
    this._dialog.close();
    this.cdr.detectChanges(); // Manual change detection
  }

  delete() {
    console.log('Deleting element...');
    this._sBs.sink = this.getElementToDelete();
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
