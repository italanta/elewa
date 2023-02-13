
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';


import { Logger } from '@iote/bricks-angular';
import { Chat } from '@elewa/model/conversations/chats';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { DataPerChatQuery, FullChat } from '@elewa/state/conversations/data';
import { ChatStatus } from '@elewa/model/conversations/chats';
import { map } from 'rxjs/operators';
import { __DateFromStorage } from '@iote/time';
import * as _ from 'lodash';

@Component({
  selector: 'app-chats-overview-table',
  templateUrl: './chats-overview-table.component.html',
  styleUrls:  ['./chats-overview-table.component.scss']
})
export class ChatsOverviewTableComponent implements OnInit, AfterViewInit
{
  isLoading = true;

  @Input() status: ChatStatus;

  dataSource: MatTableDataSource<FullChat>;
  displayedColumns = ['last-active', 'county', 'name', 'stage', 'course', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private _chats$: DataPerChatQuery,
              private _router: Router,
              private _logger: Logger)
  { }

  ngOnInit()
  {
    this.dataSource = new MatTableDataSource();
    

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this._sortData;

    this._chats$
            .get()
            // .pipe(map((chs) => chs.filter(ch => ch.chat.status === this.status)))
            .subscribe(chats => this.dataSource.data = chats);
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  private _sortData(row: FullChat, col)
  {
    switch(col) {
      case 'name': return row.chat.name;
      case 'county': return row.chat.info?.county;
      case 'phone': return row.chat.phone;

      default: return row[col];
    }
  };

  goTo = (chat: Chat) => this._router.navigate(['chats', chat.id]);

  getLastActive = (ch: FullChat) =>  __DateFromStorage(_.maxBy(ch.messages, message => __DateFromStorage(message.date).unix()).date).format('DD/MM/YYYY hh:mm:ss');
}
