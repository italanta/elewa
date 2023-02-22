import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ChatFlowStatus, Chat } from '@app/model/convs-mgr/conversations/chats';
// import { Chat, ChatFlowStatus } from '@app/model/conversations/chats';

import { Logger } from '@iote/bricks-angular';
import { __DateFromStorage } from '@iote/time';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls:  ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnChanges
{
  @Input() chat: Chat;
  @Input() currentChat: Chat;

  constructor()
  {}

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['currentChat'])
    {
      this.currentChat = changes['currentChat'].currentValue;
    }
  }

  convertDate(date: Date)
  {
    return __DateFromStorage(date);
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
