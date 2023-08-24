import { Injectable } from '@angular/core';

import { Observable, map, switchMap, combineLatest } from 'rxjs';

import { EndUserDetails } from '../models/end-user.model';
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

  getSpecificUser(id: string) {
    return this._endUser$$.getOne(id)
  }

  getAssessmentStack(id:string) {
    return this.getUserCursor(id).pipe(map((cursor => {
      const assessmentstack = cursor[0].assessmentStack;
      
      return assessmentstack ?  assessmentstack : []
    })))
  }

  /**
   * gets the endUser, their name and list of cursor's
   */
  getUserDetailsAndTheirCursor(): Observable<EndUserDetails[]> {
    return this._endUser$$.get().pipe(
      switchMap((endUsers) => {
        const userObservables = endUsers.map((user) =>
          combineLatest([
            // TODO: add a User's name to their individual properties from the bot engine.
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
