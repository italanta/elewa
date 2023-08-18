import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { SubSink } from 'subsink';
import { switchMap } from 'rxjs';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/private/state/organisation/main';
import { CLMUsersService } from '@app/private/state/user/base';

import { AddMemberModalComponent } from '../../modals/add-member-modal/add-member-modal.component';

@Component({
  selector: 'app-teams-settings',
  templateUrl: './teams-settings.component.html',
  styleUrls: ['./teams-settings.component.scss'],
})
export class TeamsSettingsComponent implements OnInit, OnDestroy {
  displayedColumns = ['logo', 'name', 'email', 'status', 'role', 'actions'];
  dataSource = new MatTableDataSource<iTalUser>();

  org: Organisation;
  orgRoles: string[];

  userRolesForm: FormGroup;

  private _sBs = new SubSink();

  constructor(
    private _orgsService: OrganisationService,
    private _clmUserService: CLMUsersService,
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getOrgRolesAndUsers();
    this.createUserRolesFormGroup();
  }

  get rowsArray() {
    return this.userRolesForm.get('rows') as FormArray;
  }

  /** get the active org's roles and users/team */
  getOrgRolesAndUsers() {
    this._sBs.sink = this._orgsService
      .getActiveOrg()
      .pipe(
        switchMap((org) => {
          this.org = org;
          this.orgRoles = org.roles;
          return this._orgsService.getOrgUsersDetails();
        })
      )
      .subscribe((users) => {
        this.dataSource.data = users;
        this.buildUserRolesFormArray(users);
      });
  }

  createUserRolesFormGroup() {
    this.userRolesForm = this._fb.group({
      rows: this._fb.array([]),
    });
  }

  buildUserRolesFormArray(users: iTalUser[]) {
    this.rowsArray.clear();

    // initialise formArray with the user roles from ActiveOrg
    users.map((user) => {
      const userRoles = user.roles[this.org.id as string];

      // Convert the user roles Object into an array of selected roles
      const selectedRoles = userRoles
        ? Object.keys(userRoles).filter((role) => userRoles[role])
        : [];

      this.rowsArray.push(
        this._fb.group({
          roles: [selectedRoles],
        })
      );
    });
  }

  /** get avatar from a user's names */
  getAvatar(user: iTalUser) {
    const names = user.displayName?.split(' ');
    const initials = names?.map((name) => name.charAt(0).toUpperCase());
    return initials?.join('');
  }

  /** remove user from org and vice versa */
  removeFromOrg(user: iTalUser) {
    this._orgsService.removeUserFromOrg(user);
  }

  /** Update a user's roles */
  updateUserRoles(userIndex: number, user: iTalUser) {
    const rolesFormControl = this.rowsArray.at(userIndex)?.get('roles') as FormArray
    const selectedRoles = rolesFormControl.value;
    this._clmUserService.updateUserRoles(user, selectedRoles);
  }

  openAddMemberDialog() {
    this._dialog.open(AddMemberModalComponent, {
      data: { roles: this.orgRoles },
      height: 'auto',
      width: '500px',
    });
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
