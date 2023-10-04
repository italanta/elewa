import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { BotElementType } from '../../model/delete-element.enum';

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
        return this._botServ$
          .deleteBot(this.element as Bot)
          .subscribe(() => this._dialog.close());
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

  delete() {
    this._sBs.sink = this.getElementToDelete();
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
