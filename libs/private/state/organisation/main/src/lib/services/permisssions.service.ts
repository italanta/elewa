import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { combineLatest, Observable } from 'rxjs';

import { UserService } from '@ngfi/angular';
import { TranslateService } from '@ngfi/multi-lang';

import { iTalUser } from '@app/model/user';
import { CLMPermissions } from '@app/model/organisation';

import { PermissionsStore } from '@app/private/state/organisation/main';
import { _CheckPermission } from '@app/private/state/access-control';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is responsible for all permission related operations.
 *  It can be used to get and update the organisation permissions.
 */
export class PermissionsStateService {
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  constructor(private _snackBar: MatSnackBar,
              private _translateService: TranslateService,
              private _permissions$$: PermissionsStore,
              private _user$$: UserService<iTalUser>
  ) {}

  /** Gets the permissions configured in the active organisation  */
  getOrgPermissions () {
    return this._permissions$$.get();
  }

  /** Sets the permissions configured in the active organisation */
  setOrgPermissions(perm: CLMPermissions) {
    return this._permissions$$.set(perm);
  }

  /** Updates the permissions for the active organisation */
  updatePermissions (perm: CLMPermissions) {
    return this._permissions$$.update(perm);
  }

  getPermissions(): Observable<[CLMPermissions, iTalUser]> {
    return combineLatest([this._permissions$$.get(), this._user$$.getUser()]);
  }

  checkAccessRight(p: any): Observable<boolean> {
    return _CheckPermission(p, this._permissions$$, this._user$$);
  }

  throwInsufficientPermissions() {
    this._snackBar.open(
      this._translateService.translate('You do not have sufficient permissions, contact administrator'),
      'Close',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2000,
      }
    );
  }
}