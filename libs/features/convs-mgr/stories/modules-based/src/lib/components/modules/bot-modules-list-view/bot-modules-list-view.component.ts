import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';

import { DeleteElementsEnum, ConfirmDeleteModalComponent, CreateModuleModalComponent } from '@app/elements/layout/convs-mgr/story-elements';

@Component({
  selector: 'italanta-apps-bot-modules-list-view',
  templateUrl: './bot-modules-list-view.component.html',
  styleUrls: ['./bot-modules-list-view.component.scss'],
})
export class BotModulesListViewComponent implements AfterViewInit {

  dataSource: MatTableDataSource<BotModule>;

  @Input() parentBot$: Observable<Bot>;

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
