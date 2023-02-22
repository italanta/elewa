import { ChatConversationComponent } from './components/chat-conversation/chat-conversation.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ChatsHomePage } from './pages/chats-home/chats-home.page';

const CHATS_ROUTERS: Route[] = [
  {
    path: '',
    component: ChatsHomePage,
    children: [
      { path: '', component: ChatConversationComponent },
      { path: ':chatId', component: ChatConversationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(CHATS_ROUTERS)],
  exports: [RouterModule]
})
export class ChatsRouterModule { }
