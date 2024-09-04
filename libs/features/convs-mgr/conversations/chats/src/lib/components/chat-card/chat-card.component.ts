import { Component, Input, SimpleChanges, OnChanges, OnInit, OnDestroy } from '@angular/core';

import { SubSink } from 'subsink';

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
export class ChatCardComponent implements OnChanges, OnInit, OnDestroy
{
  private _sbs = new SubSink()
  @Input() chat: Chat;
  @Input() currentChat: Chat;

  lastMessageDate: string;

  chatAvatarColor: string;

  constructor(private _chats$: ChatsStore, 
              private _msgsQuery$: MessagesQuery
  ) {}

  ngOnInit(): void {
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
    this.chat.name = this.chat.variables?.['name'] || '';

    const lastMessageDate = __DateFromStorage((this.chat.lastActiveTime as Date) || (this.chat.updatedOn as Date))

    this.lastMessageDate = TIME_AGO(lastMessageDate.unix());

    this.chatAvatarColor = GET_RANDOM_COLOR();
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

  getUserAvatar = (name: string) => GET_USER_AVATAR(name);

  ngOnDestroy() {
    this._sbs.unsubscribe();
  }
}
