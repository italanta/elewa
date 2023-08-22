import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService as UService } from '@ngfi/angular';
import { Query } from '@ngfi/firestore-qbuilder';

import { iTalUser } from '@app/model/user';

/**
 * This is a store for all users in the system.
 *
 * @see @ngfi/angular/auth/UserService
 */
@Injectable({ providedIn: 'root' })
export class UserStore extends UService<iTalUser>
{
  override getUser(): Observable<iTalUser>
  {
    const user = super.getUser();

    return user.pipe(map(u => ((u && u.roles.access) ? u : null) as iTalUser));
  }

  /**
   * Gets all users in the system as long as they have the access 
   */
  getUsers = () => this.getUsersBase(new Query().where('roles.access', '==', true));

  /**
   * Gets all users belonging to the active organisation
   */
  getOrgUsers(activeOrg: string): Observable<iTalUser[]>{
    return this.getUsersBase(new Query().where('orgIds', 'array-contains', activeOrg));
  }
}