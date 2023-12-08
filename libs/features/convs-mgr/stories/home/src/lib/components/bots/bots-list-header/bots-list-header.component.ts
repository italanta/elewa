import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { BotCreateFlowModalComponent } from '@app/elements/layout/convs-mgr/story-elements';

@Component({
  selector: 'italanta-apps-bots-list-header',
  templateUrl: './bots-list-header.component.html',
  styleUrls: ['./bots-list-header.component.scss'],
})
export class BotsListHeaderComponent {
  constructor(private _dialog: MatDialog) {
  }

  createBot() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      bot: '',
    };

    this._dialog.open(BotCreateFlowModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
  }
}
