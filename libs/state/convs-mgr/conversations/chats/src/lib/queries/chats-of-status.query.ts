import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy as ___orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';
import { Logger } from '@iote/bricks-angular';

import { Chat, ChatStatus } from '@app/model/convs-mgr/conversations/chats';

import { ChatsStore } from '../stores/chats.store';

/** Query that groups chats by their status */
@Injectable()
export class ChatsOfStatusQuery
{
  constructor(private _chats$$: ChatsStore,
              private _logger: Logger)
  { }

  get(status: ChatStatus) : Observable<Chat[]>
  {
    return this._chats$$
                  .get(c => c.status === status)
                  .pipe(map(ch => ___orderBy(ch, (c) => __DateFromStorage(c.createdOn as Date).unix(), 'desc')));
  }

}
