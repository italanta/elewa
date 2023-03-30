import { Pipe, PipeTransform } from '@angular/core';
import { startWith } from 'rxjs';

import { Observable, combineLatest, map, of, switchMap } from 'rxjs';

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
   * @param {Observable<any>} chatList$ An observable of users.
   * @param {Observable<string>} filterString$ An observable of the filter string [number, name etc].
   * @returns {Observable<any[]>} An observable of filtered users.
   */
  transform(chatList$: Observable<any>,filterString$: Observable<string>): Observable<any> {
    const filter$ = filterString$.pipe(startWith(''));

    return combineLatest([filter$, chatList$]).pipe(
      map(([filter, chatList]) => this.filterChatList(filter, chatList))
    );
  }

  private filterChatList(filterValue: string, chatList: any) {
    return chatList.filter(
      (chat: any) =>
        chat?.name?.toLowerCase().includes(filterValue) ||
        chat.phoneNumber.includes(filterValue)
    );
  }
}
