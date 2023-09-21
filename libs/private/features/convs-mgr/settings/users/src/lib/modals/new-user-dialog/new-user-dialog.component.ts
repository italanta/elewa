import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CLMUsersService } from '@app/private/state/user/base';

@Component({
  selector: 'clm-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss']
})
export class NewUserDialogComponent implements OnInit {

  newUserFormGroup: FormGroup;

  creatingUser: boolean = false;

  constructor(private _fb: FormBuilder,
              public dialogRef: MatDialogRef<NewUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public org: any,
              private _usersService: CLMUsersService
    ) { }

  ngOnInit(): void {
    this.buildNewUserFormGroup();    
  }

  buildNewUserFormGroup() {
    this.newUserFormGroup = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roles:[[]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  inviteNewUser() {
    if (!!this.newUserFormGroup.valid) {
      this.creatingUser = true;
      this._usersService.addUserToOrg(this.newUserFormGroup).subscribe(() => {
        this.dialogRef.close();
        this.creatingUser = false;
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
