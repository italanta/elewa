import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BotCreateFlowModalComponent } from '../../modals/bot-create-flow-modal/bot-create-flow-modal.component';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

@Component({
  selector: 'italanta-apps-bots-list-header',
  templateUrl: './bots-list-header.component.html',
  styleUrls: ['./bots-list-header.component.scss'],
})
export class BotsListHeaderComponent {
  constructor(private _dialog: MatDialog) {}

  createBot() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      story: '',
    };

    this._dialog.open(BotCreateFlowModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
  }
}
