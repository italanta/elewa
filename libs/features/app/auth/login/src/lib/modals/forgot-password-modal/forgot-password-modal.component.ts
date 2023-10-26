import {Component } from '@angular/core';
import {MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '@iote/bricks';
import { AuthService } from '@ngfi/angular';

@Component({
  selector: 'app-forgot-password-modal',
  styleUrls: ['forgot-password-modal.component.scss'],
  templateUrl: 'forgot-password-modal.component.html',
})
export class ForgotPasswordModalComponent
{
  userList: User[] = [];

  changePasswordForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading: boolean = false;
  hasError: boolean = false;

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
    this.isLoading = true;
    this.hasError = false;
    const email = this.changePasswordForm.get('email')?.value;

    this._authservice.resetPassword(email)
      .then(() => {
        this.isLoading = false
        this.exitModal()})
      .catch((error) => {        
        this.isLoading = false;
        this.hasError = true;})
  }

  exitModal = () => this._dialogRef.close();
}
