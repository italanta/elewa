import { Injectable } from '@angular/core';

import { map, mergeMap, combineLatest } from 'rxjs';

import { Observable } from 'rxjs';

import { __DateFromStorage } from '@iote/time';
import { Logger } from '@iote/bricks-angular';
import { DataService, Repository } from '@ngfi/angular';
import { PaginatedScroll } from '@ngfi/infinite-scroll';
import { Query } from '@ngfi/firestore-qbuilder';

import { Chat } from '@app/model/convs-mgr/conversations/chats';
import { Message } from '@app/model/convs-mgr/conversations/messages';

import { ActiveChatStore, ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable({
  providedIn: 'root'
})
export class MessagesQuery
{
  protected _qRepo: Repository<Message>;
  private _activeChat: Chat;
  private orgId?: string;

  chats$: Observable<Chat[]>;

  constructor(
                private _activeOrg: ActiveOrgStore,
                _activeChat$: ActiveChatStore,
                private _chats$: ChatsStore,
               private _dataService: DataService,
               protected _logger: Logger)
  {
    _activeOrg.get().subscribe(org => this.orgId = org.id);
    this.chats$ = this._chats$.get();
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

  getLatestMessage(chatId:string){
    const messagesRepo$ = this._dataService.getRepo<Message>(`orgs/${this.orgId}/end-users/${chatId}/messages`);

    const messages = messagesRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));  

    return messages.pipe(map(messages => messages ? messages[0] : {} as any));
  }

  getOrderedChats(): Observable<Chat[]> {
    return this.chats$.pipe(
      mergeMap((chats) => {
        const dateObservables = chats.map((chat) => {
          return this.getLatestMessageDate(chat.id).pipe(
            map((date) => ({
              ...chat,
              lastMsg: date
            }))
          );
        });
  
        return combineLatest(dateObservables).pipe(
            map((chatsWithDates: Chat[]) => {
              chatsWithDates.sort((a, b) => {
                // If there's no lastMsg, place the chat at the end
                if (!a.lastMsg) return 1;
                if (!b.lastMsg) return -1;
                // Sort based on the date of the latest message (more recent comes first)
                return b.lastMsg - a.lastMsg;
              });
              return chatsWithDates;
            })
        )})
      )}
}