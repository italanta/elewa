import { Pipe, PipeTransform } from '@angular/core';

import { Observable, combineLatest, map, startWith } from 'rxjs';

import { Chat } from '@app/model/convs-mgr/conversations/chats';

@Pipe({
  name: 'filter',
})
/**
 * A pipe that filters an array of users based on a provided filter string.
 * @implements {PipeTransform}
 */
export class FilterPipe implements PipeTransform {
  /**
   * Transforms an observable of the ChatList Users and an observable of string into an observable of filtered users.
   * @param {Observable<chat[]>} chatList$ An observable of users.
   * @param {Observable<string>} filterString$ An observable of the filter string [number, name etc].
   * @returns {Observable<chat[]>} An observable of filtered users.
   */
  transform(chatList$: Observable<Chat[]>,filterString$: Observable<string>): Observable<Chat[]> {
    const filter$ = filterString$.pipe(startWith(''));

    return combineLatest([filter$, chatList$]).pipe(
      map(([filter, chatList]) => this.filterChatList(filter, chatList))
    );
  }

  private filterChatList(filterValue: string, chatList: Chat[]) {
    return chatList.filter(
      (chat: Chat) =>
      chat?.phoneNumber?.startsWith(filterValue) ||
      chat?.name?.toLowerCase().includes(filterValue.toLowerCase()) 
    );
  }
}
