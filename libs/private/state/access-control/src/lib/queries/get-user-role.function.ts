import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import { UserService } from "@ngfi/angular";

import { iTalUser } from "@app/model/user";
import { CLMFeaturePermission, CLMPermissions } from "@app/model/organisation";

import { PermissionsStore } from '@app/private/state/organisation/main'

/**
 * Function which checks if the user has the correct permission for a certain claim.
 * 
 * @param permissions$    - Permissions store (where we can get the application permissions configuration)
 * @param user$$          - User service (where we can get the active user)
 * @param getPermission   - Function which resolves the permission we want to check from the application
 *                            permissions object.
 * @returns 
 */
export function _CheckPermission(getPermission: (permission: CLMPermissions) => CLMFeaturePermission, permissions$$: PermissionsStore, user$$: any) 
  : Observable<boolean>
{
  const role$ = _getUserRole(user$$);
  const permissions$ = permissions$$.get()
                                    .pipe(map(appPermissions => getPermission(appPermissions)));
  return combineLatest([permissions$, role$])
      .pipe(
        map(([permissions, roles]) => _hasPermission(permissions, roles)));

}

export function _getUserRole(user$$: UserService<iTalUser>)
{
  return user$$.getUser()
          .pipe(map((u) => u.roles[u.activeOrg]));
}

/** 
 * Core permission determination algorithm of the Clm. 
 * 
 * Checks if a user (through his/her roles) has permission to a feature/claim (through the permissions set on the feature)
 */
export function _hasPermission(permissions: any, roles: any) : any
{
  // Principal can always do everything
  if (roles.principal) {
    return true
  }

  let right: boolean = false;

  Object.keys(roles).forEach((role: any) => {
    if (roles[role] && permissions[role]) {
      right = true;
      return
    }
  })

  return right ? true : false;
}