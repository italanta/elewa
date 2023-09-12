import { Component, Input, SimpleChanges, OnChanges, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { SubSink } from 'subsink';

import { combineLatest, tap } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { ChatFlowStatus, Chat } from '@app/model/convs-mgr/conversations/chats';

import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { MessagesQuery } from '@app/state/convs-mgr/conversations/messages';

import { TIME_AGO } from '../../providers/duration-from-date';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls:  ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnChanges, AfterViewInit, OnInit, OnDestroy
{
  private _sbs = new SubSink()
  @Input() chat: Chat;
  @Input() currentChat: Chat;

  lastMessageDate: string;

  chatAvatarColor: string;

  constructor(private _chats$: ChatsStore, private _msgsQuery$: MessagesQuery) {}

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    if (this.chat) {
      this.getChatName();
    }
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['currentChat'])
    {
      this.currentChat = changes['currentChat'].currentValue;
    }
  }

  getChatName() {
    this._sbs.sink = combineLatest([this._chats$.getChatUserName(this.chat.id), 
                                    this._msgsQuery$.getLatestMessageDate(this.chat.id)])
                          .pipe(tap(([variables, date]) => {
                                  this.chat.name = variables?.name ?? '';
                                  this.chatAvatarColor = this.getAvatarColor();
                                  this.lastMessageDate = TIME_AGO(date.seconds);
                                }))
                          .subscribe();
  }

  getClass()
  {
    if(this.chat.awaitingResponse)
      return 'needs-attention';

    switch(this.chat.flow)
    {
      case ChatFlowStatus.PausedByAgent:
      case ChatFlowStatus.Paused:
        return 'paused';
      default:
        return;
    }
  }

  getAvatarColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

  getUserName(name: string) {
    if (!name) return '';

    const splitName = name.split(' ');
    if (splitName.length > 1) {
      return `${splitName[0]?.charAt(0).toUpperCase()} ${splitName[1]?.charAt(0).toUpperCase()}`;
    }
      
    return `${name.charAt(0).toUpperCase()} ${name.charAt(1).toUpperCase()}`;
  }

  ngOnDestroy() {
    this._sbs.unsubscribe();
  }
}
