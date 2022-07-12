import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService as UService } from '@ngfi/angular';
import { Query } from '@ngfi/firestore-qbuilder';

import { ItalUser } from '@ital/model/user';

/**
 * User Service for the scope of the iTalanta EcoSystem of Apps.
 *
 * @see @ngfi/angular/auth/UserService
 */
@Injectable({ providedIn: 'root' })
export class UserStore extends UService<ItalUser>
{
  getUser(): Observable<ItalUser | null>
  {
    const user = super.getUser();

    return user.pipe(map(u => (u && u.roles.access) ? u : null));
  }

  getUsers = () => this.getUsersBase(new Query().where('roles.access', '==', true));
}
