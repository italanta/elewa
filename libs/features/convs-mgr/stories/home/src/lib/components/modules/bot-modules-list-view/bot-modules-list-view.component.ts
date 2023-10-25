import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

// TODO:@LemmyMwaura This imports should come from a shared module. - fix after AT
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { 
  DeleteBotModalComponent,
  DeleteElementsEnum, 
  CreateModuleModalComponent
} from '@app/features/convs-mgr/stories/home';


@Component({
  selector: 'italanta-apps-bot-modules-list-view',
  templateUrl: './bot-modules-list-view.component.html',
  styleUrls: ['./bot-modules-list-view.component.scss'],
})
export class BotModulesListViewComponent implements AfterViewInit {

  dataSource: MatTableDataSource<BotModule>

  @Input()
  set botModulesData (value: MatTableDataSource<BotModule>) {
    this.dataSource = value
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'type', 'lastEdited', 'channel', 'actions'];
  
  constructor(private _dialog: MatDialog, private _router$$: Router) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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
