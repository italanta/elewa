import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';
import { __FormatDateFromStorage, __DateFromStorage } from '@iote/time';

import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import * as _ from 'lodash';

import { Chat, ChatFlowStatus, ChatJumpPoint, ChatStatus } from '@elewa/model/conversations/chats';
// import { FullChat } from '@elewa/state/conversations/data';
import { ChatsStore } from '@elewa/state/conversations/chats';

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
    this.dataSource = new MatTableDataSource([]);

    this._chats$
          .get(ch => ch.flow === ChatFlowStatus.Paused || ch.flow === ChatFlowStatus.PausedByAgent || ch.awaitingResponse )
          .subscribe(chats => this.dataSource.data = chats);
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this._sortData;
  }

  private _sortData(chat: Chat, col)
  {
    switch(col) {
      case 'name': return chat.name;
      case 'county': return __DateFromStorage(chat.updatedOn).unix;
      case 'phone': return chat.phone;

      default: return chat[col];
    }
  };

  getLastChatDate(chat: Chat)
  {
    return __DateFromStorage(chat.updatedOn).format('MM-DD-YYYY HH:mm:ss');
  }

  getStage(status: ChatStatus)
  {
    switch(status)
    {
      case ChatStatus.New:
        return 'Capturing Information';
      case ChatStatus.Onboarded:
        return 'Making Purchase';
      case ChatStatus.Purchased:
        return 'ITC';

      default:
        return 'Unknown';
    }
  }

  goTo = (chat: Chat) => this._router.navigate(['chats', chat.id]);
}
