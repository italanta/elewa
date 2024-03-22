import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { UserStore } from '@app/private/state/user/base';
import { CLMPermissions, Organisation } from '@app/model/organisation';
import { iTalUser } from '@app/model/user';

import { ActiveOrgStore } from '../stores/active-org.store';
import { OrgStore } from '../stores/organisation.store';
import { PermissionsStateService } from './permisssions.service';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is responsible for all organisation related operations.
 *  It can be used to create, update, delete and get organisation details e.g.
 *    update permisions, remove users, add users, etc.
 */
export class OrganisationService {

  private _sbS = new SubSink();
  
  constructor(private _router$$: Router,
              private _activeOrg$$: ActiveOrgStore,
              private _user$$: UserStore,
              private _orgs$$: OrgStore,
              private _db: AngularFirestore,
              private _aff: AngularFireFunctions,
              private _permissionsServ$: PermissionsStateService
  ){}

  /** Gets the active(current) organisation */
  getActiveOrg() {
    return this._activeOrg$$.get();
  }

  /** Gets the organisation details in which the user belongs to */
  getUserOrgDetails() {
    return combineLatest([this._activeOrg$$.get(), this._orgs$$.get()]);
  }

  /** Get details of the users in an organisation */
  getOrgUsersDetails(): Observable<iTalUser[]> {
    return this._activeOrg$$.get().pipe(switchMap((org) => org ? this._user$$.getOrgUsers(org.id as string) : []));
  }

  /** Creates an organisation */
  createOrg(org: Organisation, user: iTalUser) {
    const id = this._db.createId();

    const orgWithId = { 
      ...org,
      id: id,
      logoUrl: org.logoUrl ?? '',
      email: org.email ?? '',
      phone: org.phone ?? '',
      createdBy: user.id,
    };

    this._sbS.sink = this._aff
      .httpsCallable('assignUserToCreatedOrg')(orgWithId)
      .pipe(tap((perm:CLMPermissions) => this.setPermissions(perm)))
      .subscribe(() => this._afterCreateOrg());
  }

  private setPermissions(perm: CLMPermissions) {
    this._permissionsServ$.setOrgPermissions(perm);
  }

  private _afterCreateOrg() {
    // give time for permissions to set ('less than 5sec doesn't always work')
    setTimeout(() => this._router$$.navigate(['/home']), 5000);
  }

  /** Switches the active org to a new one */
  switchOrganisation(activeOrg: string){
    let userData: iTalUser;
    this._sbS.sink = this._user$$.getUser().pipe(take(1)).subscribe(u => {
      userData = u
      userData.activeOrg = activeOrg
      this._user$$.updateUser(userData).then(() => window.location.reload())
    });
  }

  updateOrgDetails(org: Organisation, fileUrl?: string) {
    org.logoUrl = fileUrl ?? '';

    this._orgs$$.update(org).subscribe();
  }

  getOrgPermissions () {
    return this._permissionsServ$.getOrgPermissions();
  }

  updateOrgPermissions(permissions: FormGroup) {
    return this._permissionsServ$.updatePermissions(permissions.value);
  }

  removeUserFromOrg(user: iTalUser) {
    this._activeOrg$$.get().pipe(take(1)).subscribe( async(org) => {
      if (org) {
        org.users.splice(org.users.indexOf(user.id as string), 1);
        this.updateOrgDetails(org);
        await this.removeOrgFromUser(user, org);
      }
    })
  }

  async removeOrgFromUser(user: iTalUser, org: Organisation) {
    user.orgIds.splice(user.orgIds.indexOf(org.id as string), 1);

    const userOrg = user.activeOrg;
    user.activeOrg = userOrg === org.id ? user.orgIds.length > 0 ? user.orgIds[0] : ''
                                                : userOrg;
    await this._user$$.updateUser(user);
  }
}