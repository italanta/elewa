import { AfterContentChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { flatMap as __flatMap, groupBy as __groupBy, 
         keys as __keys, pickBy as __pickBy } from 'lodash';

import { CLMPermissions } from '@app/model/organisation';
import { Organisation } from '@app/model/organisation';

import { AppClaimDomains } from '@app/private/model/access-control';
import { iTalUser } from '@app/model/user';

import { OrganisationService, PermissionsStore } from '@app/private/state/organisation/main';

import { PermissionsModel } from '../../models/permissions.model';

import { PermissionsModelService } from '../../services/permissions.service';
import { PermissionsFormsService } from '../../services/permissions-forms.service';

@Component({
  selector: 'clm-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
  private _sbS = new SubSink();

  org: Organisation;
  users: iTalUser[];

  _page: string[];

  public model: PermissionsModel;

  permissions: CLMPermissions;
  permissionsLoaded = false;
  roles : string[];

  userRoles: any[];

  isEditMode: boolean;

  orgLoaded = false;
  usersLoaded = false;

  readonly CAN_PERFOM_ADMIN_ACTIONS = AppClaimDomains.Admin;

  constructor(private _router$$: Router,
              private _orgService: OrganisationService,
              private _permissionsService: PermissionsModelService,
              private _permissionsFormService: PermissionsFormsService,
              private _ts: PermissionsStore,
  ) { }

  ngOnInit(): void {
    this._page = this._router$$.url.split('/');

    this.getActiveOrg();

    this.model = this._permissionsFormService.initModalState(this._page[1]);
    this.model.getUserRolesAndPermissions();
  }

  ngAfterViewInit(): void {}

  ngAfterContentChecked(): void {
    this.roles = this.model.roles;
    this.permissions = this.model.permissions;
    this.permissionsLoaded = this.model.permissionsLoaded;
  }

  getActiveOrg() {
    this._sbS.sink = this._orgService.getActiveOrg().subscribe((org) => {
      if (org) {
        this.org = org;
        this.orgLoaded = true;
        this.getOrgUsers();
      }
    })
  }

  getOrgUsers() {
    this._permissionsService._getOrgUsers(this.org.id!).subscribe((users) => {
      if (users) {
        this.users = users;        
        this.userRoles = [];
        let userRoles = __flatMap(__flatMap(this.users, 'roles'), this.org.id!);

        if (this.org) {
          this.org.roles.forEach((role) => {
            this.userRoles.push(this.countValues(userRoles, role));
          })
        }
        this.usersLoaded = true;
      }
    })
  }

  countValues(roles: any, role: any) {
    let filter  = roles.filter((roles: any) => roles[role] === true);
    let roleLength = __keys(__pickBy(filter)).length;
    let roleKeys = __keys(__pickBy(filter[0]));
    return [roleKeys[0], roleLength];
  }

  addRole() {
    this._permissionsService.createNewRole(this.model.permissionsFormGroup);
  }

  updateRolesPermissions() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.model.permissionsFormGroup.enable();
    } else {
      this._orgService.updateOrgPermissions(this.model.permissionsFormGroup);
      this.model.permissionsFormGroup.disable();
    }
  }

  deleteRole() {
    this._permissionsService.deleteRole(this.model.permissionsFormGroup);
  }

  ngOnDestroy(): void {
    this._permissionsFormService.endModelState();
  }
}
