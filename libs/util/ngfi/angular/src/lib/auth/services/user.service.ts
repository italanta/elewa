import { Injectable } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";

import { map, tap } from "rxjs/operators";

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from "@iote/bricks";
import { Logger } from "@iote/bricks-angular";
import { Query } from '@ngfi/firestore-qbuilder';

/**
 * Wrapper around Firebase User Services. RxJS subscriptions.
 *
 *
 * @see https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/
 * @param T: xAn extension of user with the correct UserProfile Type.
 */
@Injectable({ providedIn: 'root' })
export abstract class UserService<T extends User>
{
  protected _user$: Observable<T | null>;

  constructor(private _logger: Logger,
              private _afAuth: AngularFireAuth,
              private _afs: AngularFirestore)
  {
    // Set user variable. Observe the firebase user.
    this._user$ = this._initUserSubject();
  }

  /** Get auth data, then get firestore user document || false */
  public getUser(): Observable<T> {
    return this._user$ as Observable<T>;
  }

  public getUserId(): Observable<string> {
    return this.getUser()
      .pipe(map(u => u.uid));
  }

  public updateUser(user: T) {
    return this._afs.doc<User>(`users/${user.uid}`).update(user);
  }

  public abstract getUsers(): Observable<T[]>;

  protected getUsersBase(q: Query): Observable<T[]> {
    const coll = this._afs.collection<T>(
                    'users',
                    q.__buildForFireStore.bind(q) as any);

    return coll.valueChanges();
  }

  private _initUserSubject() : Observable<T>
  {
    return this._afAuth
                .user
                .pipe(switchMap(user =>
                          // Switch to subscription, if doc changes everything changes.
                          ((user && user.uid) ? this._afs.doc<T>(`users/${user.uid}`).valueChanges()
                                              : of(null)) as Observable<T>),

                      tap(u => this._logger.log(() => u ? `[UserService] Retrieved user ${(u as T).id}`
                                                        : 'User not set yet.')));
  }
}
