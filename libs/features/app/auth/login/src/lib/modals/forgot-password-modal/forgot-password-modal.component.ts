import {Component } from '@angular/core';
import {MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '@ngfi/angular';
import { User } from '@iote/bricks';

// import { UserStore } from '@elewa/state/user';

@Component({
  selector: 'app-forgot-password-modal',
  styleUrls: ['forgot-password-modal.component.scss'],
  templateUrl: 'forgot-password-modal.component.html',
})
export class ForgotPasswordModalComponent
{
  userList: User[];

  changePasswordForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private _fb: FormBuilder,
              private _dialogRef: MatDialogRef<ForgotPasswordModalComponent>,
              private _authservice: AuthService)
  { }

  validateEmail()
  {
    return this.changePasswordForm.valid;
  }

  ifEmailExists(formEmail: string)
  {
    return this.userList.find((user)=> user.email === formEmail);
  }

  resetPassword()
  {
    const email = this.changePasswordForm.get('email')?.value;
    this._authservice.resetPassword( email );
    this.exitModal()
    // if(this.ifEmailExists(email))
    // {
    // }
    // else{
    //   alert('No user found registered with this email.')
    // }
  }

  exitModal = () => this._dialogRef.close();

}
