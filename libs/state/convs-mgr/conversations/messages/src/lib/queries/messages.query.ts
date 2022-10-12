import { Injectable } from '@angular/core';

import { __DateFromStorage } from '@iote/time';
import { Logger } from '@iote/bricks-angular';
import { DataService, Repository } from '@ngfi/angular';
import { PaginatedScroll } from '@ngfi/infinite-scroll';

import { Chat } from '@app/model/convs-mgr/conversations/chats';
import { ChatMessage } from '@app/model/convs-mgr/conversations/messages';

import { ActiveChatStore } from '@app/state/convs-mgr/conversations/chats';

@Injectable()
export class MessagesQuery
{
  protected _qRepo: Repository<ChatMessage>;
  private _activeChat: Chat;

  constructor(_activeChat$: ActiveChatStore,
               private _dataService: DataService,
               protected _logger: Logger)
  {
    // _activeChat$.get()
    //             .subscribe(chat => this._activeChat = chat);
  }

  getPaginator(chat: Chat)
  {
    this._activeChat = chat;
    
    return new PaginatedScroll<ChatMessage>
                  ({ path: ['sessions', this._activeChat.id, 'messages'],
                     limit: 20,
                     orderByField: 'date',
                     orderByFn: (date: Date) => __DateFromStorage(date).unix,
                     reverse: true, prepend: true
                   },
                   this._dataService.__db);
  }

  // get(index: number, n: number): Observable<ChatMessage[]>
  // {

  //   return this._qRepo.getDocuments(new Query().orderBy('date', 'desc')
  //                                              .skipTake(index, n))
  // }
}
