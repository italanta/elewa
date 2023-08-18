import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { iTalUser } from '@app/model/user';

import { UserStore } from '@app/state/user';

import { AddNewOrgRoleModalComponent } from '../modals/add-new-org-role-modal/add-new-org-role-modal.component';
import { DeleteOrgRoleModalComponent } from '../modals/delete-org-role-modal/delete-org-role-modal.component';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class PermissionsModelService {

  constructor(private _dialog: MatDialog,
              private _userService: UserStore
              
  ) {}

  _getOrgUsers(org: string): Observable<iTalUser[]> {
    return this._userService.getOrgUsers(org);
  }

  createNewRole(permissions: FormGroup) {
    const dialogRef = this._dialog.open(AddNewOrgRoleModalComponent, {
      minWidth: '500px',
      data: permissions,
    });
  }

  deleteRole(permissions: FormGroup) {
    const dialogRef = this._dialog.open(DeleteOrgRoleModalComponent, {
      minWidth: '500px',
      data: permissions,
    });
  }
}
