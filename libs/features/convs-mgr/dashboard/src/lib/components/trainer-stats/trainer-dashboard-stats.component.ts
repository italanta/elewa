import { Component} from '@angular/core';

import { Chat, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';
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
  pendingAssessments: number;

  constructor(private _chats$: ChatsStore)
  {
    this._chats$.get().subscribe(chats => this.getChatStats(chats));
  }

  getChatStats(chats: Chat[])
  {
    this.engagedChats = chats.length;
    this.activeChats = chats.filter(chat => chat.flow !== ChatFlowStatus.Completed).length;
    const helpRequests = chats.filter(chat => chat.flow === ChatFlowStatus.Paused).length;
    const offlineRequests = chats.filter(chat => chat.flow === ChatFlowStatus.OnWaitlist).length;
    this.seekingAssistance = helpRequests + offlineRequests;
    this.pendingAssessments = chats.filter(chat => chat.flow === ChatFlowStatus.PendingAssessment).length;
  }
  
}
