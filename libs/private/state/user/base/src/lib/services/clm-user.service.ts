import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';

import { flatMap as __flatMap, find as __find, keys as __keys, uniq } from 'lodash';

import { AuthService } from '@ngfi/angular';

import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/private/state/organisation/main';

import { iTalUser } from '@app/model/user';
import { UserStore } from '@app/state/user';

@Injectable({
  providedIn: 'root',
})

/**
 * This service contains methods for managing and retrieving the users of an organisation
 */
export class CLMUsersService {
  private _sbS = new SubSink();

  org: Organisation;
  orgUsers: iTalUser[];

  constructor(private _dialog: MatDialog,
              private _bs: AngularFireFunctions,
              private _user$$: UserStore,
              private _orgsService: OrganisationService,
              private _authService: AuthService
  ) 
  {
    this.getOrg();
  }

  /**
   * Updates the details of the passed in user from the form group
   */
  updateUserDetails(user: iTalUser, org: Organisation, userFormGroup: FormGroup) {
    user.roles  = user.roles as any;
    user.displayName = `${userFormGroup.value.firstName} ${userFormGroup.value.lastName}`;

    const userOrgRoles = __keys(user.roles[this.org.id as keyof typeof user.roles]).concat(org.roles);
    user.roles[this.org.id as keyof typeof user.roles] = this.createUserRoles(uniq(userOrgRoles), userFormGroup.value.roles, true);

    return this._user$$.updateUser(user);
  }

  /**
   * Updates the username of the passed in user from the form group
   */
  updateUserName(user: iTalUser, userFormGroup: FormGroup) {
    user.displayName = `${userFormGroup.value.firstName} ${userFormGroup.value.lastName}`;
    this._user$$.updateUser(user).then(() => this._dialog.closeAll());
  }


  updateUserRoles(user: iTalUser, roles:string[]) {
    user.roles[this.org.id as string] = this.createUserRoles(this.org.roles, roles, true)
    this._user$$.updateUser(user).then(() => this._dialog.closeAll());
  }

  /**
   * Gets and sets the active organisation
   */
  getOrg() {
    this._sbS.sink = this._orgsService.getActiveOrg().subscribe((org) => {
      if (org?.id) {
        this.org = org;
        this.getAllOrgUsers(org.id);
      }
    });
  }

  /**
   * Gets all the users belonging to a particular organisation
   */
  getAllOrgUsers(org: string) {
    this._sbS.sink = this._orgsService.getOrgUsersDetails()
      .subscribe((users) => {
        this.orgUsers = users;
      });
  }

  /**
   * Gets the display names of all users from the user ids
   */
  getOrgUsers(userIds: string[]): string[] {
    if (this.orgUsers) {
      let users: any = this.orgUsers.filter((users) =>
        userIds.includes(users.id as string)
      );
      users = __flatMap(users, 'displayName');
      return users;
    }
    return [];
  }

  /**
   * Resolves the user objects from the users array in the organisation
   */
  getOrgUsersProperties(userIds: string[]): iTalUser[] {
    if (this.orgUsers) {
      const users = this.orgUsers.filter((users) => userIds.includes(users.id as string));
      return users;
    }
    return [];
  }

  /**
   * Gets the user object from the user id
   */
  getOrgUser(userId: string): iTalUser {
    return __find(this.orgUsers, { id: userId }) as iTalUser;
  }

  /**
   * Checks if the user is assigned the passed in role
   */
  isUserAssignedRole(role: string, roles: string[]): boolean {
    return roles.includes(role);
  }

  /**
   * Adds the user to the organisation from the form
   */
  addUserToOrg(userFormGroup: FormGroup) {
    const userData = userFormGroup.value;
    const user: iTalUser = {
      displayName: this.getUserDisplayName(userData),
      orgIds: [this.org.id as string],
      activeOrg: this.org.id as string,
      profile: {
        phone: userData?.phone ?? '',
        email: userData?.email ?? '',
      },
      roles: {
        [this.org.id as string] : this.createUserRoles(this.org.roles, userData.roles, false),
        access: true,
      },
      uid: '',
      email: userData.email,
    }; 

    return this._bs.httpsCallable('createNewUser')(user);
  }

  /** get a User's displayName */
  getUserDisplayName(userData: any) {
    if (!userData.firstName || !userData.lastName) {
      return ''
    } else {
      return `${userData?.firstName} ${userData?.lastName}`
    }
  }

  /**
   * Initializes the user roles object
   */
  createUserRoles(orgRoles: string[], roles: string[], editingUser: boolean) {    
    const rolesObj: any = {};

    orgRoles.forEach((orgRole) => {
      rolesObj[orgRole] = roles.includes(orgRole) ? true : false;
    })

    if (!editingUser) {
      rolesObj['access'] = false;
      rolesObj['principal'] = false;
    }

    return rolesObj;
  }

  /**
   * Sets the user photo from the uploaded url
   */
  updateUserPhotoUrl(userData: iTalUser, fileUrl: string) {
    userData.photoUrl = fileUrl;
    this._user$$.updateUser(userData);
  }

  /**
   * Allows the user to update their password
   */
  updatePassword(email: string) {
    this._authService.resetPassword(email);
  }
}