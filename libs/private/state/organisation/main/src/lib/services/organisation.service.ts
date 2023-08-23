import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { UserStore } from '@app/private/state/user/base';
import { Organisation } from '@app/model/organisation';
import { iTalUser } from '@app/model/user';

import { ActiveOrgStore } from '../stores/active-org.store';
import { OrgStore } from '../stores/organisation.store';
import { PermissionsStore } from '../stores/permissions.store';

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
              private _permissionsStore: PermissionsStore
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
  createOrg(org: Organisation) {
    const id = this._db.createId();

    const orgWithId = { 
      ...org,
      id: id,
      logoUrl: '',
      email: '',
      phone: '',
    };

    this._sbS.sink = this._orgs$$.add(orgWithId, id)
      .pipe(take(1))
      .subscribe(o => this._afterCreateOrg(o));
  }

  private _afterCreateOrg(org: Organisation) {
    this._router$$.navigate(['/home']);
    this._activeOrg$$.setOrg(org);
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

    this._orgs$$.update(org).subscribe((org) => {
      if (org) {
        window.location.reload();
      }
    });
  }

  getOrgPermissions () {
    return this._permissionsStore.get();
  }

  updateOrgPermissions(permissions: FormGroup) {
    return this._permissionsStore.create(permissions.value);
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