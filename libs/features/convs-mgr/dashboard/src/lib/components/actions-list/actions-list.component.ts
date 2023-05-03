import * as _ from 'lodash';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Logger } from '@iote/bricks-angular';
import { __FormatDateFromStorage, __DateFromStorage } from '@iote/time';

import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { ChatJumpPoint, Chat, ChatFlowStatus, ChatStatus } from '@app/model/convs-mgr/conversations/chats';

@Component({
  selector: 'elewa-actions-list',
  templateUrl: './actions-list.component.html',
  styleUrls:  ['./actions-list.component.scss']
})

export class ActionsListomponent implements OnInit, AfterViewInit
{
  isLoading = true;

  stages: ChatJumpPoint[];

  dataSource: MatTableDataSource<Chat>;
  displayedColumns = ['new-msg', 'last-chat', 'name', 'stage', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private _chats$: ChatsStore,
              private _router: Router,
              private _logger: Logger)
  { }

  ngOnInit()
  {
    this.dataSource = new MatTableDataSource([] as any);

    this._chats$
          .get(ch => ch.flow === ChatFlowStatus.Paused || ch.flow === ChatFlowStatus.PausedByAgent || ch.awaitingResponse as boolean)
          .subscribe(chats => this.dataSource.data = chats);
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this._sortData;
  }

  private _sortData(chat: Chat, col: string | number)
  {
    switch(col) {
      case 'name': return chat.name;
      case 'county': return __DateFromStorage(chat.updatedOn as Date).unix;
      case 'phone': return chat.phoneNumber;

      default: return chat[col as keyof Chat];
    }
  };

  getLastChatDate(chat: Chat)
  {
    return __DateFromStorage(chat.updatedOn as Date).format('MM-DD-YYYY HH:mm:ss');
  }

  getStage(status: ChatStatus)
  {
    switch(status)
    {
      case ChatStatus.Running:
        return 'Running';
      case ChatStatus.Paused:
        return 'Paused';
      case ChatStatus.PausedByAgent:
        return 'PausedByAgent';

      default:
        return 'Unknown';
    }
  }

  goTo = (chat: Chat) => this._router.navigate(['chats', chat.id]);
}
