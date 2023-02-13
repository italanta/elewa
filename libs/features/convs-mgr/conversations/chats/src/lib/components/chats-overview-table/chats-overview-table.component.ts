import { Component, OnInit, ViewChild, Input, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';

import { Logger } from '@iote/bricks-angular';
import { Chat, ChatFlowStatus } from '@elewa/model/conversations/chats';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// DataPerChatQuery
// import { FullChat } from '@elewa/state/conversations/data';
import { ChatStatus } from '@elewa/model/conversations/chats';
import { ChatsStore } from '@elewa/state/conversations/chats';

// import { map } from 'rxjs/operators';
import { __DateFromStorage } from '@iote/time';
import * as _ from 'lodash';
import { DataService, Repository } from '@ngfire/angular';
import { Payment, PaymentStatus } from '@elewa/model/finance/payments';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chats-overview-table',
  templateUrl: './chats-overview-table.component.html',
  styleUrls:  ['./chats-overview-table.component.scss']
})
export class ChatsOverviewTableComponent implements OnInit, AfterViewInit, OnChanges
{
  isLoading = true;
  data: Chat[];

  _repo: Repository<Payment>;
  paidCustomers: string[] = [];

  @Input() status: ChatStatus;
  @Input() filter: string;
  filterString: string;

  dataSource: MatTableDataSource<Chat>;
  displayedColumns = ['new-msg', 'color', 'name', 'last-active', 'status', 'county', 'course', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private _chats$: ChatsStore,
              private _router: Router,
              _dS: DataService,
              private _logger: Logger)
  { 
    this._repo = _dS.getRepo<Payment>('payments');
    this._repo
        .getDocuments()
        .pipe(
          map(ps => ps.filter(p => p.status === PaymentStatus.Success)),
          map(ps => _.orderBy(ps, p => __DateFromStorage(p.timestamp).unix(), 'desc')))
        .subscribe((list)=> list.forEach(payment => this.paidCustomers.push(payment.chatId)));
  }

  ngOnInit()
  {
    this.dataSource = new MatTableDataSource();

    this._chats$
            .get()
            // .pipe(map((chs) => chs.filter(ch => ch.chat.status === this.status)))
            .subscribe(chats => this.loadData(chats));
  }

  ngAfterViewInit()
  {
    this.dataSource.filterPredicate = this._filterData.bind(this);
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this._sortData;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['filter']){
      this.filter = changes['filter'].currentValue;
      if(this.dataSource) this.applyFilter();
    }
  }

  loadData(chats: Chat[])
  {
    this.data = chats;
    this.dataSource.data = this.data;
    this.applyFilter();
    this.isLoading = false;
  }

  private _sortData(chat: Chat, col)
  {
    switch(col) {
      case 'name': return   chat.name;
      case 'county': return chat.info?.county;
      case 'last-active': return  chat.updatedOn;
      case 'status': return  chat.flow;

      default: return chat[col];
    }
  }

  getStatus(flowCode: number)
  {
    switch(flowCode){
      case ChatFlowStatus.Flowing:
        return "Ongoing";
      case ChatFlowStatus.Paused:
        return "Requested for Assistance";
      case ChatFlowStatus.PausedByAgent:
        return "Paused by Trainer";
      case ChatFlowStatus.Completed:
        return "Completed";
      case ChatFlowStatus.PendingAssessment:
        return "Pending Assessment";
      case ChatFlowStatus.OnWaitlist:
        return "Offline Help Request";
      case ChatFlowStatus.Stashed:
        return "Stashed";
      case ChatFlowStatus.Disabled:
        return "Disabled";
    }
  }

  getClass(element: any)
  {
    switch(element.flow)
    {
      case ChatFlowStatus.Flowing:
        return 'active';
      case ChatFlowStatus.Completed:
        return 'complete';
      case ChatFlowStatus.Disabled:
      case ChatFlowStatus.Stashed:
        return '';
      default:
        return 'paused';
    }
  }

  isFlowing(element: any) 
  {
    return element.flow === ChatFlowStatus.Flowing ;
  }

  hasCompleted(element: any)
  {
    return element.flow === ChatFlowStatus.Completed;
  }

  isInactive(chat: Chat)
  {
    return chat.flow === ChatFlowStatus.Stashed || chat.flow === ChatFlowStatus.Disabled;
  }

  needsAttention(element: any)
  {
  }

  goTo = (chat: Chat) => this._router.navigate(['chats', chat.id]);

  getLastChatDate(chat: Chat)
  {
    return __DateFromStorage(chat.updatedOn).format('MM-DD-YYYY HH:mm:ss');
  }

  private _filterData(row: Chat, filter: string)
  {
    const rowFilter = (`${row.name}`).toLowerCase();
    return rowFilter.includes(filter);
  }

  applyFilter(filtrString?: string)
  {
    if(filtrString)
    {
      this.filterString = filtrString;
      return this.dataSource.filter = filtrString;
    }
    else if(this.filterString){
      this.filterString = '';
      return this.dataSource.filter = '';
    }

    switch(this.filter)
    {
      case "active":
        this.filterString = '';
        this.dataSource.data = this.data.filter(chat => chat.flow === ChatFlowStatus.Flowing);
        break;
      case "paused":
        this.filterString = '';
        this.dataSource.data = this.data.filter(chat => chat.flow === ChatFlowStatus.Paused ||
                                                        chat.flow === ChatFlowStatus.OnWaitlist ||
                                                        chat.awaitingResponse);
        break;
      case "paused-by-agent":
        this.filterString = '';
        this.dataSource.data = this.data.filter(chat => chat.flow === ChatFlowStatus.PausedByAgent);
        break;
      case "learning":
        this.filterString = '';
        this.dataSource.data = this.data.filter(chat => this.paidCustomers.includes(chat.id) && !this.hasCompleted(chat) && !this.isInactive(chat));
        break;
      case "stashed":
        this.filterString = '';
        this.dataSource.data = this.data.filter(chat => chat.flow === ChatFlowStatus.Stashed);
        break;
      case "completed":
        this.filterString = '';
        this.dataSource.data = this.data.filter(chat => chat.flow === ChatFlowStatus.Completed);
        break;
      case 'all':
      default:
        this.dataSource.data = this.data;
        this.dataSource.filter = '';        
    }

  }
      
}
