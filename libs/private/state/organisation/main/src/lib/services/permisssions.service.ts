import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PermissionsStore } from '../stores/permissions.store';
@Injectable({
  providedIn: 'root'
})

/**
 * This service is responsible for all organisation related operations.
 *  It can be used to create, update, delete and get organisation details e.g.
 *    update permisions, remove users, add users, etc.
 */
export class PermissionsService {
  
  constructor(private _permissionsStore: PermissionsStore){}
  /** Gets the permissions configured in the active organisation  */
  getOrgPermissions () {
    return this._permissionsStore.get();
  }

  updateOrgPermissions(permissions: FormGroup) {
    return this._permissionsStore.create(permissions.value);
  }
}