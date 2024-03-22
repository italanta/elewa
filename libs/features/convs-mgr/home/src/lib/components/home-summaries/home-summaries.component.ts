import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';

import { Chat, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';

@Component({
  selector: 'italanta-apps-home-summaries',
  templateUrl: './home-summaries.component.html',
  styleUrls: ['./home-summaries.component.scss'],
})
export class HomeSummariesComponent implements OnInit, OnDestroy {

  private _sbs = new SubSink();

  engagedChats: number;
  activeChats: number;
  seekingAssistance: number;
  pausedChats: number;
  
  constructor(private _chats$: ChatsStore) {
    this._sbs.sink = this._chats$.get().subscribe(chats => this.getChatStats(chats));
  }

  ngOnInit(): void {}

  getChatStats(chats: Chat[])
  {
    this.engagedChats = chats.length;
    this.activeChats = chats.filter(chat => chat.status === ChatStatus.Running).length;
    this.seekingAssistance = chats.filter(chat => chat.isConversationComplete === -1).length;
    this.pausedChats = chats.filter(chat => chat.status === (ChatStatus.PausedByAgent)).length;
  }

  ngOnDestroy() {
    this._sbs.unsubscribe()
  }
}
