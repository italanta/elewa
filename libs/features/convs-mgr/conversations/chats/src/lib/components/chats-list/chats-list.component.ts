import { AfterViewInit, ChangeDetectorRef, Component, QueryList, ViewChildren, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FormControl } from '@angular/forms';

import { SubSink } from 'subsink';

import * as _ from 'lodash';

import { Observable, combineLatest } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { DataService } from '@ngfi/angular';
import { Logger } from '@iote/bricks-angular';
import { __DateFromStorage } from '@iote/time';

import { Chat, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';

import { ActiveChatConnectedStore, ChatsListState, ChatsListStateProvider } from '@app/state/convs-mgr/conversations/chats';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements AfterViewInit, OnDestroy
{
  private _sbs = new SubSink()
  currentChat: Chat;

  chats$: Observable<Chat[]>;

  isLoading = true;
  filter = "All";
  filterMode = false;
  selected = "All";
  chats: Chat[];
  displayedChats: Chat[] = [];
  filtrString = '';
  paidCustomers: string[] = [];

  searchString$: Observable<string>

  search = new FormControl<string>('');

  dataSource: MatTableDataSource<any>;
  helpRequests: Chat[];
  learning: Chat[];
  onboarding: Chat[];
  paused: Chat[];
  completed: Chat[];
  stashed: Chat[];
  blocked: Chat[];
  _state$$: ChatsListState;
  totalPageCount: number;
  currentPage: number;
  
  @ViewChildren(MatPaginator) paginator: QueryList<MatPaginator>;

  constructor(
    // private _chats$: ChatsStore,
    private _chats$: ChatsListStateProvider,
    private _activeChat$: ActiveChatConnectedStore,
    private cd: ChangeDetectorRef,
    _dS: DataService,
    private _logger: Logger)
  {
    this._sbs.sink = this._activeChat$.get().pipe(filter(x => !!x)).subscribe((chat) => this.currentChat = chat);

    this._state$$ = this._chats$.getChatListState();

    this.searchString$ = this.search.valueChanges as Observable<string>;
    
    this.chats$ = combineLatest([this.searchString$.pipe(startWith('')), this._state$$.getChats()])
    .pipe(map(([s, c]) => s == '' ? c : 
    c.filter((c) =>  this._searchChat(c, s))
    ));
    
    this._sbs.sink = this.chats$.subscribe(chatList => this.getChats(chatList));
  }
  
  ngAfterViewInit()
  {
    this._state$$.getPageCount().subscribe((count)=> this.totalPageCount = (count - 1));
    this._state$$.getPage().subscribe((page)=> this.currentPage = (page + 1));
  }

  goToPage(page: number) 
  {
    this._state$$.goToPage(page);
  }

  getChats(chatList: Chat[])
  {
    this.chats = chatList;

    this.isLoading = false;
  }

  move(direction: 'past' | 'future') 
  {
    this.isLoading = true;

    this._state$$.nextPage(direction);
  }


  updateList(event: any)
  {
    this.isLoading = true;
    this.filter = event.target.value;
    this.filterByCategory();
  }

  filterByCategory()
  {

    switch (this.filter) {
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
      case "blocked":
        this._state$$.filterChats('blocked');
        break;
      case 'all':
      default:
        this._state$$.filterChats('');
    }
    this.dataSource.data = this.displayedChats;
    this.isLoading = false;
  }

  _searchChat(chat: Chat, searchTerm: string): boolean {
    const combinedProperties = Object.keys(chat)
      .map(key => chat[key])
      .join(' ')
      .toLowerCase();

    return combinedProperties.includes(searchTerm.toLocaleLowerCase());
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

  ngOnDestroy() {
    this._sbs.unsubscribe()
  }
}
