import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { keys as __keys, pickBy as __pickBy } from 'lodash';

import { SubSink } from 'subsink';

import { Observable, tap } from 'rxjs';

import { iTalUser } from '@app/model/user';
import { UserService, AuthService} from '@ngfi/angular';

import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/private/state/organisation/main';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit
{
  private _sbS = new SubSink();

  user$: Observable<iTalUser>;

  swicthOrg: FormControl = new FormControl('');

  userOrgs: Organisation[];
  organisation: Organisation;
  filteredOrgs: Organisation[];

  userRoles: string[];
  
  constructor(userService: UserService<iTalUser>,
              private _router: Router,
              private _authService: AuthService,
              private _orgsService: OrganisationService)
  {
    this.user$ = userService.getUser();
  }

  ngOnInit(): void {
    this.getOrganisationDetails();
    this._sbS.sink = this.getValueChanges(this.swicthOrg).subscribe();
  }

  isAdmin = (user: any) => user.roles.admin;
  toAdmin = () => this._router.navigate(['admin', 'translate']);

  getValueChanges(formControl: FormControl) {
    return formControl.valueChanges.pipe();
  }

  getOrganisationDetails() {
    this._sbS.sink = this._orgsService.getUserOrgDetails().subscribe(([activeOrg, userOrgs]) => {
      if (activeOrg && userOrgs) {
        this.userOrgs = userOrgs;
        this.organisation = userOrgs.filter((orgs) => { return orgs.id == activeOrg.id })[0];
        this.filteredOrgs = this.userOrgs.slice();
      }
    });
  }

  switchOrg(activeOrg: any) {
    this._orgsService.switchOrganisation(activeOrg.id);
  }

  getUserRoles(user: iTalUser) {
    return  __keys(__pickBy(user.roles[user.activeOrg]));
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  logout() {
    this._authService.signOut('/auth/login');
  }
}
