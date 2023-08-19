import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { UserService } from '@ngfi/angular';

import { iTalUser } from '@app/model/user';
import { CLMPermissions } from '@app/model/organisation';

import { PermissionsStore } from '@app/private/state/organisation/main';

import { AccessQuery } from '../../base/access-query';
import { _CheckPermission } from '../get-user-role.function';

@Injectable()
export class PerformCreateAssessmentsActionRightsQuery extends AccessQuery {
  
  constructor(private _permissions$$: PermissionsStore,
              private _user$$: UserService<iTalUser>
  ) {
    super();
  }

  protected override _hasWriteAccess(): Observable<boolean> {
    return _CheckPermission(
      (p: CLMPermissions) => p.AssessmentSettings.CanCreateAssessments,
      this._permissions$$,
      this._user$$
    );
  }

  /** Disable read-access to admin actions */
  protected override _hasReadAccess = () => of(false);
}