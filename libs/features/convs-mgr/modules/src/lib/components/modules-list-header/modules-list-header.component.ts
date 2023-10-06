import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { CreateModuleModalComponent } from '@app/features/convs-mgr/stories/home';

@Component({
  selector: 'app-modules-list-header',
  templateUrl: './modules-list-header.component.html',
  styleUrls: ['./modules-list-header.component.scss'],
})
export class ModulesListHeaderComponent {
  constructor(private _dialog: MatDialog) {}

  createBot() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      bot: '',
    };

    this._dialog.open(CreateModuleModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
  }
}
