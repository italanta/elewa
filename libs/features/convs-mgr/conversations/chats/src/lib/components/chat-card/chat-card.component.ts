import { Component, Input, SimpleChanges, OnChanges, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { SubSink } from 'subsink';

import { combineLatest, tap } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { ChatFlowStatus, Chat } from '@app/model/convs-mgr/conversations/chats';

import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { MessagesQuery } from '@app/state/convs-mgr/conversations/messages';

import { TIME_AGO } from '../../providers/duration-from-date';
import { GET_RANDOM_COLOR, GET_USER_AVATAR } from '../../providers/avatar.provider';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls:  ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnChanges, AfterViewInit, OnDestroy
{
  private _sbs = new SubSink()
  @Input() chat: Chat;
  @Input() currentChat: Chat;

  lastMessageDate: string;

  chatAvatarColor: string;

  constructor(private _chats$: ChatsStore, 
              private _msgsQuery$: MessagesQuery
  ) {}

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
                                  this.chatAvatarColor = GET_RANDOM_COLOR();
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

  getUserName = (name: string) => GET_USER_AVATAR(name);

  ngOnDestroy() {
    this._sbs.unsubscribe();
  }
}
