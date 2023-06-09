import { Injectable } from '@angular/core';

import { Observable, map, switchMap, combineLatest } from 'rxjs';

import { EndUserDetails } from '../models/endUser.model';
import { EndUsersStore } from '../store/end-user.store';

@Injectable({
  providedIn: 'root',
})
export class EndUserService {
  constructor(private _endUser$$: EndUsersStore) {}

  getAllUsers() {
    return this._endUser$$.get();
  }

  getUserCursor(id: string) {
    return this._endUser$$.getCurrentCursor(id);
  }

  /**
   * gets the endUser, their name and list of cursor's
   */
  getUserDetailsAndTheirCursor(): Observable<EndUserDetails[]> {
    return this._endUser$$.get().pipe(
      switchMap((endUsers) => {
        const userObservables = endUsers.map((user) =>
          combineLatest([
            this._endUser$$.getUserName(user.id as string),
            this._endUser$$.getCurrentCursor(user.id as string),
          ]).pipe(
            map(([name, cursor]) => ({ user, name, cursor }))
          )
        );
  
        return combineLatest(userObservables);
      })
    );
  }
}
