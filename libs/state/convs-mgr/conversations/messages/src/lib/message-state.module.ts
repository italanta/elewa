import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from '@ngfi/infinite-scroll';

import { ChatsStateModule } from '@app/state/convs-mgr/conversations/chats';

import { MessagesQuery } from './queries/messages.query';

@NgModule({
  imports: [
    InfiniteScrollModule,
    ChatsStateModule
  ],
  providers: [
    MessagesQuery
  ]
})
export class MessageStateModule { }
