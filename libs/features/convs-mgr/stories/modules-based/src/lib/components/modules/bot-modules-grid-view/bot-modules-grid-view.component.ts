import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';

import { 
  DeleteElementsEnum, 
  CreateModuleModalComponent,
  ConfirmDeleteModalComponent
} from '@app/elements/layout/convs-mgr/story-elements';

@Component({
  selector: 'italanta-apps-bot-modules-grid-view',
  templateUrl: './bot-modules-grid-view.component.html',
  styleUrls: ['./bot-modules-grid-view.component.scss'],
})
export class BotModulesGridViewComponent {
  @Input() parentBot$: Observable<Bot>;
  @Input() botModules: BotModule[] = [];

  constructor(private _router$$: Router,
              private _dialog: MatDialog
  ) {}

  openBot(botId: string, id: string) {
    this._router$$.navigate(['bots', botId, 'modules', id]);
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
    this._dialog.open(ConfirmDeleteModalComponent, {
      minWidth: 'fit-content', 
      data: { 
        mode: DeleteElementsEnum.BotModule, element: botModule,
      }
    }).afterClosed();
  }
}
