import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { __DateFromStorage } from '@iote/time';
import { Logger } from '@iote/bricks-angular';
import { DataService, Repository } from '@ngfi/angular';
import { PaginatedScroll } from '@ngfi/infinite-scroll';
import { Query } from '@ngfi/firestore-qbuilder';

import { Chat } from '@app/model/convs-mgr/conversations/chats';
import { Message } from '@app/model/convs-mgr/conversations/messages';

import { ActiveChatStore, ChatsStore } from '@app/state/convs-mgr/conversations/chats';
import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { Observable, of } from 'rxjs';


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
    if (!this.orgId) {
      throw new Error('Organization ID is not set. Call setOrgId(orgId) first.');
    }
    const chatsList = this._chatStore.get();
  
    // Create an array to store the dates
    const datesArray: any[] = [];
  
    chatsList.subscribe((chats) => {
      chats.forEach((chat) => {
        console.log('Chat ID:', chat.id);
        this.getLatestMessageDate(chat.id).subscribe((date) => {
          console.log(date);
  
          // Push the date into the array
          datesArray.push(date);
  
          // Check if all dates have been collected
          if (datesArray.length === chats.length) {
            // Sort the dates in descending order
            datesArray.sort((a, b) => b.seconds - a.seconds || b.nanoseconds - a.nanoseconds);
  
            // Now, datesArray contains the dates sorted from most recent to least recent
            console.log('Sorted Dates:', datesArray);
          }
        });
      });
    });
  
    // You can use the provided chats array here or fetch them as needed
    return chatsList; // Assuming you have imported 'of' from 'rxjs'
  }
  
  
}
