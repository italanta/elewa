import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';

import { take } from 'rxjs';

import { Logger } from '@iote/bricks-angular';
import { __DateFromStorage } from '@iote/time';

import { ChatFlowStatus, Chat } from '@app/model/convs-mgr/conversations/chats';
import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls:  ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnChanges, OnInit
{
  @Input() chat: Chat;
  @Input() currentChat: Chat;

  constructor(private _chats$: ChatsStore)
  {}

  ngOnInit() {
    this.getChatName();
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
      variableValues.pipe(take(1)).subscribe((values)=> this.chat.name = values.name);
    }
  }

  convertDate(date: Date | undefined)
  {
    return __DateFromStorage(date as Date);
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
