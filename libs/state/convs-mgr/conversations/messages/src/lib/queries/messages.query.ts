import { Injectable } from '@angular/core';

import {  map } from 'rxjs/operators';

import { __DateFromStorage } from '@iote/time';
import { Logger } from '@iote/bricks-angular';
import { DataService, Repository } from '@ngfi/angular';
import { PaginatedScroll } from '@ngfi/infinite-scroll';
import { Query } from '@ngfi/firestore-qbuilder';

import { Chat } from '@app/model/convs-mgr/conversations/chats';
import { Message } from '@app/model/convs-mgr/conversations/messages';

import { ActiveOrgStore } from '@app/private/state/organisation/main';



@Injectable({
  providedIn: 'root'
})
export class MessagesQuery
{
  protected _qRepo: Repository<Message>;
  private _activeChat: Chat;
  private orgId?: string;

  constructor(private _activeOrg: ActiveOrgStore,
              private _dataService: DataService,
              protected _logger: Logger)
  {
    _activeOrg.get().subscribe(org => this.orgId = org.id);
  }

  getPaginator(chat: Chat)
  {
    
    this._activeChat = chat;
    
    return new PaginatedScroll<Message>
                  ({ path: [`orgs/${this.orgId}/end-users`, this._activeChat.id, 'messages'],
                     limit: 20,
                     orderByField: 'createdOn',
                     orderByFn: (date: Date) => __DateFromStorage(date).unix,
                     reverse: true, prepend: true
                   },
                   this._dataService.__db);
  }

  getLatestMessageDate(chatId: string) {
    
    const messagesRepo$ = this._dataService.getRepo<Message>(`orgs/${this.orgId}/end-users/${chatId}/messages`);

    const messages = messagesRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));  

    return messages.pipe(map(messages => messages ? messages[0].createdOn : {} as any));
  }

  addMessage(message: Message) {

    const messagesRepo$ = this._dataService.getRepo<Message>(`orgs/${this.orgId}/end-users/${this._activeChat.id}/messages`);

    return messagesRepo$.create(message, Date.now().toString());
  }

  // get(index: number, n: number): Observable<ChatMessage[]>
  // {

  //   return this._qRepo.getDocuments(new Query().orderBy('date', 'desc')
  //                                              .skipTake(index, n))
  // }
 
}

