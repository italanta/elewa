import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService as UService } from '@ngfi/angular';
import { Query } from '@ngfi/firestore-qbuilder';

import { iTalUser } from '@app/model/user';

/**
 * User Service for the scope of the iTalanta EcoSystem of Apps.
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

  getUsers = () => this.getUsersBase(new Query().where('roles.access', '==', true));

  getOrgUsers(activeOrg: string): Observable<iTalUser[]>{
    return this.getUsersBase(new Query().where('orgIds', 'array-contains', activeOrg));
  }
}
