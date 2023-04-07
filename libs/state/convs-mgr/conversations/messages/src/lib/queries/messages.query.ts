import { Injectable } from '@angular/core';

import { __DateFromStorage } from '@iote/time';
import { Logger } from '@iote/bricks-angular';
import { DataService, Repository } from '@ngfi/angular';
import { PaginatedScroll } from '@ngfi/infinite-scroll';

import { Chat } from '@app/model/convs-mgr/conversations/chats';
import { Message } from '@app/model/convs-mgr/conversations/messages';

import { ActiveChatStore } from '@app/state/convs-mgr/conversations/chats';
import { ActiveOrgStore } from '@app/state/organisation';
import { Query } from '@ngfi/firestore-qbuilder';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesQuery
{
  protected _qRepo: Repository<Message>;
  private _activeChat: Chat;

  constructor(
                private _activeOrg: ActiveOrgStore,
                _activeChat$: ActiveChatStore,
               private _dataService: DataService,
               protected _logger: Logger)
  {
    // _activeChat$.get()
    //             .subscribe(chat => this._activeChat = chat);
  }

  getPaginator(chat: Chat)
  {
    const orgId = this._activeOrg._activeOrg; 
    
    this._activeChat = chat;
    
    return new PaginatedScroll<Message>
                  ({ path: [`orgs/${orgId}/end-users`, this._activeChat.id, 'messages'],
                     limit: 20,
                     orderByField: 'createdOn',
                     orderByFn: (date: Date) => __DateFromStorage(date).unix,
                     reverse: true, prepend: true
                   },
                   this._dataService.__db);
  }

  getLatestMessageDate(chatId: string) {
    const orgId = this._activeOrg._activeOrg;
    
    const messagesRepo$ = this._dataService.getRepo<Message>(`orgs/${orgId}/end-users/${chatId}/messages`);

    const messages = messagesRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));  

    return messages.pipe(map(messages => messages[0].createdOn));
  }

  addMessage(message: Message) {
    const orgId = this._activeOrg._activeOrg;

    const messagesRepo$ = this._dataService.getRepo<Message>(`orgs/${orgId}/end-users/${this._activeChat.id}/messages`);

    return messagesRepo$.create(message, Date.now().toString());
  }

  // get(index: number, n: number): Observable<ChatMessage[]>
  // {

  //   return this._qRepo.getDocuments(new Query().orderBy('date', 'desc')
  //                                              .skipTake(index, n))
  // }
}
