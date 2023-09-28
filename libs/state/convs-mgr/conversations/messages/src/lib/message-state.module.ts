import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from '@ngfi/infinite-scroll';

import { MessagesQuery } from './queries/messages.query';

@NgModule({
  imports: [
    InfiniteScrollModule,
  ],
  providers: [
    MessagesQuery
  ]
})
export class MessageStateModule { }
