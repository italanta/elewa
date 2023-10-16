import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { CreateModuleModalComponent } from '@app/features/convs-mgr/stories/home';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modules-list-header',
  templateUrl: './modules-list-header.component.html',
  styleUrls: ['./modules-list-header.component.scss'],
})
export class ModulesListHeaderComponent {
  activeBotId:string;

  constructor(private _dialog: MatDialog, private _route: ActivatedRoute) {
    this.activeBotId = this._route.snapshot.paramMap.get('id') as string;
  }

  createBot() {
    const dialogData = {
      botMode: BotMutationEnum.CreateMode,
      botId: this.activeBotId
    };

    this._dialog.open(CreateModuleModalComponent, {
      minWidth: '600px',
      data: dialogData,
    });
  }
}
