import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Chat } from '@app/model/convs-mgr/conversations/chats';

import { ChatsStore } from './chats.store';

/** Active Chat Store that fires when the Chat object updates.
 *
 *  @warning: Do not use in state libraries to load children
 *              -> Will result in reload of child collections every time this object updates!
 *                 While only thing we need for load of child collections is the chat id.
*/
@Injectable({
    providedIn: 'root'
  })
export class ActiveChatConnectedStore extends Store<Chat>
{
  protected store = 'active-chat-connected-store';

  constructor(_chatsStore: ChatsStore,
              _router: Router)
  {
    super(null as any);

    const chats$ = _chatsStore.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
                                       map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([chats$,  route$])
                        .subscribe(([chats, route]) =>
    {
      const chatId = this._getRoute(route);

      if(chatId !== '__noop__')
      {
        const chat = chats.find(p => p.id === chatId);
        this.set(chat as Chat, 'UPDATE - FROM DB || ROUTE');
      }
      else{
        this.set(null as any, 'UPDATE - FROM DB || ROUTE');
      }

    });
  }

  private _getRoute(route: NavigationEnd) : string
  {
    const elements = route.url.split('/');
    const propId = elements.length >= 3 ? elements[2] : '__noop__';

    return propId;
  }

  override get = () => super.get().pipe(filter(val => val != null));

}
