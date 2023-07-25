import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { EventLogger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';

import { UserStore } from '@app/state/user';
import { iTalUser } from '@app/model/user';

import { PermissionsStore } from '../stores/permissions.store';
import { ActiveOrgStore } from '../stores/active-org.store';
import { OrgStore } from '../stores/organisation.store';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  private _sbS = new SubSink();
  
  constructor(private _router$$: Router,
              private _activeOrg$$: ActiveOrgStore,
              private _user$$: UserStore,
              private _orgs$$: OrgStore,
              private _analytics: EventLogger,
              private _db: AngularFirestore,
              private _permissionsStore: PermissionsStore
  ){}

  getActiveOrg() {
    return this._activeOrg$$.get();
  }

  getUserOrgDetails() {
    return combineLatest([this._activeOrg$$.get(), this._orgs$$.get()]);
  }

  getOrgUsersDetails(): Observable<iTalUser[]> {
    return this._activeOrg$$.get().pipe(switchMap((org) => !!org ? this._user$$.getOrgUsers(org.id!) : []));
  }

  createOrg(org: Organisation) {
    const id = this._db.createId();
    const orgWithId = { 
      ...org, 
      id: id,
      logoUrl: '',
      vatNo: '',
      bankAccounts: [],
      email: '',
      phone: '',
     };
    this._sbS.sink = this._orgs$$.add(orgWithId, id)
      .pipe(take(1))
      .subscribe(o => this._afterCreateOrg(o),
        (err) => this._analytics.logEvent('generate_lead_error', { errorMsg: err }));
  }

  private _afterCreateOrg(org: Organisation) {
    this._analytics.logEvent('generate_lead', { id: org?.id, name: org?.name });
    this._router$$.navigate(['/home']);
    this._activeOrg$$.setOrg(org);
  }

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
    this._permissionsStore.create(permissions.value);
  }

  removeUserFromOrg(user: iTalUser) {
    this._activeOrg$$.get().pipe(take(1)).subscribe((org) => {
      if (org) {
        org.users.splice(org.users.indexOf(user.id!), 1);
        this.updateOrgDetails(org);
        this.removeOrgFromUser(user, org);
      }
    })
  }

  removeOrgFromUser(user: iTalUser, org: Organisation) {
    user.orgs.splice(user.orgs.indexOf(org.id!), 1);
    let userOrg = user.activeOrg;
    user.activeOrg = userOrg === org.id ? user.orgs.length > 0 ? user.orgs[0] : '' 
                                                : userOrg;
    this._user$$.updateUser(user).then(() => {});
  }
}