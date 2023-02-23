import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Chat } from '@app/model/convs-mgr/conversations/chats';

import { ActiveChatConnectedStore } from './active-chat-connected.store';

@Injectable({
  providedIn: 'root'
})
export class ActiveChatStore extends Store<Chat>
{
  protected store = 'active-chat-store';
  private _activeChatId : string;

  constructor(_activeChat$$: ActiveChatConnectedStore)
  {
    super(null as any);

    const chats$ = _activeChat$$.get().pipe(filter(ch => ch && ch.id !== this._activeChatId));

    this._sbS.sink = chats$.subscribe(chat =>
    {
      this._activeChatId = chat.id;
      this.set(chat, 'UPDATE - FROM DB || ROUTE');
    });
  }

  override get = () => super.get().pipe(filter(val => val != null));

}
