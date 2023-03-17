import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';

import { Chat, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';
import { ActiveChatConnectedStore } from '@app/state/convs-mgr/conversations/chats';

@Component({
  selector: 'app-chats-detail-page',
  templateUrl: './chats-detail.page.html',
  styleUrls:  ['./chats-detail.page.scss']
})
export class ChatsDetailPage implements OnInit
{
  chat$: Observable<Chat>;
  messages$: Observable<Chat[]>;
  chatStatus: ChatFlowStatus;
  chatId: string;

  isLoading = true;

  constructor(private _activeChat$: ActiveChatConnectedStore,
              private _logger: Logger)
  { }

  ngOnInit()
  {
    this.chat$ = this._activeChat$.get();
  }
}
