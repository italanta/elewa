import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { 
  DeleteBotModalComponent,
  DeleteElementsEnum, 
  CreateModuleModalComponent
} from '@app/elements/layout/convs-mgr/story-elements';

@Component({
  selector: 'italanta-apps-bot-modules-grid-view',
  templateUrl: './bot-modules-grid-view.component.html',
  styleUrls: ['./bot-modules-grid-view.component.scss'],
})
export class BotModulesGridViewComponent {
  
  @Input() botModules: BotModule[] = [];

  constructor(private _router$$: Router,
              private _dialog: MatDialog
  ) {}

  openBot(id: string) {
    this._router$$.navigate(['/modules', id]);
  }

  editBot(botModule: BotModule) {
    this._dialog.open(CreateModuleModalComponent, {
      minWidth: '600px', 
      data: { 
        botMode: BotMutationEnum.EditMode, botModule: botModule
      }
    }).afterClosed();
  }

  deleteBot(botModule: BotModule) {
    this._dialog.open(DeleteBotModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.BotModule, element: botModule,
      }
    }).afterClosed();
  }
}
