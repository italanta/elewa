import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '@ngfi/angular';

import { iTalUser } from '@app/model/user';
import { CLMPermissions } from '@app/model/organisation';

import { PermissionsStore } from '@app/private/state/organisation/main';

import { AccessQuery } from '../../base/access-query';

@Injectable()
export class PerformAdminActionRightsQuery extends AccessQuery
{
  private _user: iTalUser;

  constructor(private _userService: UserService<iTalUser>)
  { super(); }


  protected override _hasViewAccess() : Observable<boolean>
  {
    return this._userService.getUser().pipe(
      map((user)=> !!user && user.roles[user.activeOrg].admin!)
    );
  }

  /** Disable read-access to admin actions */
  protected override _hasReadAccess = () => of(false);
}