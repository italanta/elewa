import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChatsStore } from './stores/chats.store';
import { ActiveChatStore } from './stores/active-chat.store';

import { ChatsOfStatusQuery } from './queries/chats-of-status.query';
import { ActiveChatConnectedStore } from './stores/active-chat-connected.store';
import { ChatsListStateProvider } from './stores/chats-list-state.provider';

@NgModule({
  imports: [RouterModule],
  providers: [ChatsOfStatusQuery]
})
export class ChatsStateModule
{
  static forRoot(): ModuleWithProviders<ChatsStateModule>
  {
    return {
      ngModule: ChatsStateModule,
      providers: [
        ChatsStore,
        ActiveChatConnectedStore,
        ActiveChatStore,
        ChatsListStateProvider
      ]
    };
  }
}
