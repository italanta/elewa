import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {flatMap as __flatMap, keys as __keys, pickBy as __pickBy} from 'lodash';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';
import { AppClaimDomains } from '@app/private/model/access-control';

import { UserStore, CLMUsersService } from '@app/private/state/user/base';
import { OrganisationService } from '@app/private/state/organisation/main';

import { UpdateProfilePictureModalComponent } from '../..//modals/update-profile-picture-modal/update-profile-picture-modal.component';

@Component({
  selector: 'clm-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  org$: Observable<Organisation>;
  user: iTalUser;

  userFormGroup: FormGroup;

  roles: string;
  userDetailsLoaded: boolean;

  editProfile: boolean = false;

  readonly CAN_PERFOM_ADMIN_ACTIONS = AppClaimDomains.Admin;

  constructor(private _dialog: MatDialog,
              private _fb: FormBuilder,
              private _orgService: OrganisationService,
              private _user$$: UserStore,
              private _userService: CLMUsersService
  ) { }

  ngOnInit(): void {
    this.org$ = this._orgService.getActiveOrg();
    this.getUser();
  }

  getUser() {
    this._user$$.getUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this.userDetailsLoaded = true;
        this.user = user;
        this.roles =  __keys(__pickBy(user.roles[user.activeOrg])) as any;
        this.buildUserFormGroup(user);
      }
    })
  }

  buildUserFormGroup(user: iTalUser) {
    let name: string[] = user.displayName!.split(' ');
    this.userFormGroup = this._fb.group({
      firstName: [name[0]],
      lastName: [name[1]],
      email: [user.email],
    })
    this.userFormGroup.disable();
  }

  editUserProfile() {
    this.editProfile = !this.editProfile;
    if (this.editProfile) {
      this.userFormGroup.enable();
    } else {
      this.updateUserName();
      this.userFormGroup.disable();
    }
  }

  cancelEdit() {
    this.editProfile = false;
  }

  updateUserName() {
    this._userService.updateUserName(this.user, this.userFormGroup);
  }

  updatePassword() {
    this._user$$.getUser().pipe(take(1)).subscribe((user) => {
      if (user) {
        this._userService.updatePassword(user.email);
       }
    })
  }

  newProfileImg() {
    this._dialog.open(UpdateProfilePictureModalComponent, {
      data: this.user}).afterClosed().subscribe();
  }
}
