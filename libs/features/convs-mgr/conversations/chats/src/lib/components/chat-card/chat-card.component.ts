import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';

import { take } from 'rxjs';

import { Logger } from '@iote/bricks-angular';
import { __DateFromStorage } from '@iote/time';

import { ChatFlowStatus, Chat } from '@app/model/convs-mgr/conversations/chats';
import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { MessagesQuery } from '@app/state/convs-mgr/conversations/messages';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls:  ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnChanges, OnInit
{
  @Input() chat: Chat;
  @Input() currentChat: Chat;

  lastMessageDate: string;

  constructor(private _chats$: ChatsStore, private _msgsQuery$: MessagesQuery)
  {}

  ngOnInit() {
    this.getChatName();
    this.setLastMessageDate();
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['currentChat'])
    {
      this.currentChat = changes['currentChat'].currentValue;
    }
  }

  getChatName() {
    const variableValues = this._chats$.getChatUserName(this.chat.id);

    if(variableValues) {
      variableValues.subscribe((values)=> this.chat.name = values.name);
    }
  }

  setLastMessageDate() {
    this._msgsQuery$.getLatestMessageDate(this.chat.id).subscribe((date) => { 
      const newDate = __DateFromStorage(date as Date);
      this.lastMessageDate = newDate.format('DD/MM/YYYY HH:mm');
    }
    );
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

}
