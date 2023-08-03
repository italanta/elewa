import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PermissionsStore } from '../stores/permissions.store';
@Injectable({
  providedIn: 'root'
})

/**
 * This service is responsible for all permission related operations.
 *  It can be used to get and update the organisation permissions.
 */
export class PermissionsService {
  
  constructor(private _permissionsStore: PermissionsStore){}
  /** Gets the permissions configured in the active organisation  */
  getOrgPermissions () {
    return this._permissionsStore.get();
  }

  /** Updates the permissions for the active organisation */
  updateOrgPermissions(permissions: FormGroup) {
    return this._permissionsStore.update(permissions.value);
  }
}