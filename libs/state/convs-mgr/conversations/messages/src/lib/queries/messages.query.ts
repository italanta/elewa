import { Injectable } from '@angular/core';

import {  map, mergeMap } from 'rxjs/operators';
import {  combineLatest} from 'rxjs';

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

  constructor(
                private _activeOrg: ActiveOrgStore,
                _activeChat$: ActiveChatStore,
               private _dataService: DataService,
               private _chatStore : ChatsStore,
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


  getChats() {
    const chatsList = this._chatStore.get();
  
    return chatsList.pipe(
      // Use mergeMap to map each chat to an observable of its latest message date
      mergeMap((chats) => {
        // Create an array of observables to fetch the latest message date for each chat
        const dateObservables = chats.map((chat) => {
          return this.getLatestMessageDate(chat.id).pipe(
            map((date) => ({
              ...chat,
              lastMsg: date,
            }))
          );
        });
  
        // Use forkJoin to wait for all date observables to complete
        return combineLatest(dateObservables).pipe(
          map((chatsWithDates) => {
            // Sort the chats based on the last message date in descending order
            chatsWithDates.sort((a, b) => {
              // Ensure that null dates (error cases) are placed at the end
              if (a.lastMsg === null) return 1;
              if (b.lastMsg === null) return -1;
              return b.lastMsg - a.lastMsg;
            });
            return chatsWithDates;
          })
        );
      })
    );
  }
  
}

