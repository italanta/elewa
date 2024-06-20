import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { CLMPermissions } from '@app/model/organisation';

import { OrganisationService } from '@app/private/state/organisation/main';

import { PermissionsModel } from '../models/permissions.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionsFormsService {

  private _sbS = new SubSink();

  private _state: PermissionsModel | null;

  constructor(private _fb: FormBuilder,
              private _orgService$$: OrganisationService,
  ) 
  { }

  initModalState(_page: string): PermissionsModel {
    if (!this._state) {
      const model = new PermissionsModel(this._fb, _page, this, this._orgService$$);
      this._state = model;
    }

    return this._state as PermissionsModel;
  }

  getModalState(): PermissionsModel {
    if (!this._state) throw new Error('[PermissionsModel] State not initialised.');

    return this._state as PermissionsModel;
  }

  _initPermissionsFormGroup(permissionsFormGroup: FormGroup, permissions: CLMPermissions) 
  {
    const domains = permissionsFormGroup.controls;
    Object.keys(domains).forEach(domain => {      
      const domainControls = permissionsFormGroup.get(domain) as FormGroup;
      const roleControls = domainControls.controls

      Object.keys(roleControls).forEach(perGroup => 
      {
        const permission = domainControls.get(perGroup) as FormGroup;
        this.patchRole(permissions, domain, perGroup, permission);
      });
    });
  }

  patchRole(permissions: CLMPermissions, domainKey: string, domainGroup: string, permissionsGroup: FormGroup) {
    const domain = permissions[domainKey as keyof CLMPermissions] as any;
    const domG = domain[domainGroup];
    
    const keys = Object.keys(domG);
    keys.forEach((role, index) => {
      permissionsGroup.addControl(role, new FormControl(domG[role]));
    })
  }

  endModelState() 
  {
    this._state = null;
  }
}
