import { Component} from '@angular/core';

import { Chat, ChatFlowStatus, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';

@Component({
  selector: 'elewa-trainer-stats',
  templateUrl: './trainer-dashboard-stats.component.html',
  styleUrls:  ['./trainer-dashboard-stats.component.scss']
})

export class TrainerStatsComponent
{
  engagedChats: number;
  activeChats: number;
  seekingAssistance: number;
  pausedChats: number;

  constructor(private _chats$: ChatsStore)
  {
    this._chats$.get().subscribe(chats => this.getChatStats(chats));
  }

  getChatStats(chats: Chat[])
  {
    this.engagedChats = chats.length;
    this.activeChats = chats.filter(chat => chat.status === ChatStatus.Running).length;
    this.seekingAssistance = chats.filter(chat => chat.isConversationComplete === -1).length;
    this.pausedChats = chats.filter(chat => chat.status === (ChatStatus.PausedByAgent)).length;
  }
  
}
