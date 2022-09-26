import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from '@ngfi/infinite-scroll';

import { ChatsStateModule } from '@app/state/convs-mgr/conversations/chats';

import { MessagesQuery } from './queries/messages.query';

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    
    ChatsStateModule
  ],
  providers: [MessagesQuery]
})
export class MessageStateModule
{
  static forRoot(): ModuleWithProviders<MessageStateModule>
  {
    return {
      ngModule: MessageStateModule,
      providers: [

      ]
    };
  }
}
