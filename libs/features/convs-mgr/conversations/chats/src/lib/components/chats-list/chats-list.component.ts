import * as _ from 'lodash';

import { AfterViewInit, ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DataService } from '@ngfi/angular';
import { Logger } from '@iote/bricks-angular';
import { __DateFromStorage } from '@iote/time';

import { Chat, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';
import { Payment, PaymentStatus } from '@app/model/finance/payments';

import { ChatsStore, ActiveChatConnectedStore } from '@app/state/convs-mgr/conversations/chats';


@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls:  ['./chats-list.component.scss']
})
export class ChatsListComponent implements AfterViewInit
{
  currentChat: Chat;

  chats$: Observable<Chat[]>;

  isLoading = true;
  filter = "All";
  filterMode = false;
  selected = "All";
  chats: Chat[];
  displayedChats: Chat[] = [];
  filtrString: string = '';
  paidCustomers: string[] = [];

  dataSource: MatTableDataSource<any>;
  helpRequests: Chat[];
  learning: Chat[];
  onboarding: Chat[];
  paused: Chat[];
  completed: Chat[];
  stashed: Chat[];

  @ViewChildren(MatPaginator) paginator: QueryList<MatPaginator>;

  constructor(private _chats$: ChatsStore,
              private _activeChat$: ActiveChatConnectedStore,
              private cd: ChangeDetectorRef,
              _dS: DataService,
              private _logger: Logger)
  {
    const _repo = _dS.getRepo<Payment>('payments');
    _repo
        .getDocuments()
        .pipe(
          map(ps => ps.filter(p => p.status === PaymentStatus.Success)),
          map(ps => _.orderBy(ps, p => __DateFromStorage(p.timestamp).unix(), 'desc')))
        .subscribe((list)=> list.forEach(payment => this.paidCustomers.push(payment.chatId)));

    this._activeChat$.get().pipe(filter(x => !!x)).subscribe((chat) => this.currentChat = chat);

    this.chats$ = this._chats$.get();
    this.chats$.subscribe(chatList => this.getChats(chatList));
  }

  ngAfterViewInit()
  {
    // Update paginator after it is initialized
    this.paginator.changes.subscribe(item => {
      if (this.paginator.length && this.dataSource) {
        this.dataSource.paginator = this.paginator?.first;
        this.cd.detectChanges();
      }
    })
  }

  getChats(chatList: Chat[])
  {
    this.dataSource = new MatTableDataSource<any>();
    this.chats$ = this.dataSource.connect();

    this.chats = chatList;
    this.initializeLists();
    //Set into categories
    chatList.forEach(chat => this.categorize(chat));
    if(!this.filtrString) this.filtrString = '';
    this.applyFilter();
    this.dataSource.paginator = this.paginator?.first;
    this.isLoading = false;
  }

  initializeLists()
  {
    this.learning = [];
    this.paused = [];
    this.helpRequests = [];
    this.onboarding = [];
    this.completed = [];
    this.stashed = [];
  }

  categorize(chat: Chat)
  {
    switch(chat.flow)
    {
      case ChatFlowStatus.PausedByAgent:
        this.paused.push(chat);
        this.helpRequests.push(chat);
        break;
      case ChatFlowStatus.Flowing:
        this.onboarding.push(chat);
        break;
      case ChatFlowStatus.Paused:
      case ChatFlowStatus.OnWaitlist:
        this.helpRequests.push(chat);
        break;
      case ChatFlowStatus.Completed:
        this.completed.push(chat);
        break;
      case ChatFlowStatus.Stashed:
        this.stashed.push(chat);
        break;
    }
    if(chat.awaitingResponse && (chat.flow !== ChatFlowStatus.Paused
                              && chat.flow !== ChatFlowStatus.OnWaitlist
                              && chat.flow !== ChatFlowStatus.PausedByAgent))
    {
      this.helpRequests.push(chat);
    }

    if(this.paidCustomers.includes(chat.id) && !this.hasCompleted(chat) && !this.isInactive(chat))
    {
      this.learning.push(chat);
    }
  }

  applyFilter(evt?: { target: EventTarget | null; } | undefined)
  {
    this.filterByCategory();
    if(evt)
      this.filtrString = (evt.target as HTMLInputElement).value.trim().toLowerCase();

      this.displayedChats = this.displayedChats.filter(chat => chat.name.toLowerCase().includes(this.filtrString));
      this.dataSource.data = this.displayedChats;
  }

  toggleFilter()
  {
    this.filterMode = !this.filterMode;
    if(!this.filterMode)
    {
      this.filtrString = '';
      this.filterByCategory();
    }
  }

  updateList(filter: string, title: string)
  {
    this.isLoading = true;
    this.filter = filter;
    this.selected = title;
    this.filterByCategory();
  }

  filterByCategory()
  {

    switch(this.filter)
    {
      case "active":
        this.displayedChats = this.onboarding;
        break;
      case "paused":
        this.displayedChats = this.helpRequests;
        break;
      case "paused-by-agent":
        this.displayedChats = this.paused;
        break;
      case "learning":
        this.displayedChats = this.learning;
        break;
      case "stashed":
        this.displayedChats = this.stashed;
        break;
      case "completed":
        this.displayedChats = this.completed;
        break;
      case 'all':
      default:
        this.displayedChats = this.chats;
    }
    this.dataSource.data = this.displayedChats
    this.isLoading = false;
  }

  hasCompleted(element: any)
  {
    return element.flow === ChatFlowStatus.Completed;
  }

  isInactive(chat: Chat)
  {
    return chat.flow === ChatFlowStatus.Stashed || chat.flow === ChatFlowStatus.Disabled;
  }

  isMobile()
  {
    return !window.matchMedia("(min-width: 480px)").matches;
  }
}
