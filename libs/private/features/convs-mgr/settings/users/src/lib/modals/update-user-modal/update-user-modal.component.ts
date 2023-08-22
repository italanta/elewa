import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { keys as __keys, pickBy as __pickBy } from 'lodash';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';

import { CLMUsersService } from '@app/private/state/user/base';

@Component({
  selector: 'clm-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.scss']
})
export class UpdateUserModalComponent implements OnInit {

  updateUserForm: FormGroup;

  updatingUserDetails:boolean = false;

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              public dialogRef: MatDialogRef<UpdateUserModalComponent>,
              @Inject(MAT_DIALOG_DATA) public userData: {org: Organisation, user: iTalUser},
              private _userService: CLMUsersService
  ) { }

  ngOnInit(): void {
    this.buildUpdateFormGroup(this.userData.user);
  }

  buildUpdateFormGroup(user: iTalUser) {
    let firstName = user.displayName?.split(' ')[0];
    let lastName = user.displayName?.split(' ')[1];
    let roles = __keys(__pickBy(user.roles[this.userData.org.id!]));

    this.updateUserForm = this._fb.group({
      firstName: [firstName ?? ''],
      lastName: [lastName ?? ''],
      email: [user.email ?? ''],
      roles: [roles ?? []]
    })
  }

  updateUserDetails() {
    this.updatingUserDetails = true;
    this._userService.updateUserDetails(this.userData.user, this.updateUserForm).then(() => this.completeOperations());;
  }

  completeOperations() {
    this.updatingUserDetails = false;
    this._dialog.closeAll();
  }
}
