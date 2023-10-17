import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

// TODO:@LemmyMwaura This imports should come from a shared module. - fix after AT
import { 
  DeleteBotModalComponent,
  DeleteElementsEnum, 
  CreateModuleModalComponent
} from '@app/features/convs-mgr/stories/home';

@Component({
  selector: 'app-bot-modules-grid-view',
  templateUrl: './bot-modules-grid-view.component.html',
  styleUrls: ['./bot-modules-grid-view.component.scss'],
})
export class BotModulesGridViewComponent {
  
  dataSource: MatTableDataSource<BotModule>;

  @Input()
  set botModulesData (value: MatTableDataSource<BotModule>) {
    this.dataSource = value
  }

  constructor(private _router$$: Router,
              private _dialog: MatDialog
  ) {}

  openBot(id: string) {
    this._router$$.navigate(['modules', id]);
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
