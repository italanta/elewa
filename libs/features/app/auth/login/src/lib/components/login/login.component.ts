import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FirebaseError } from 'firebase-admin';
import { EventLogger } from '@iote/bricks-angular';
import { AuthService } from '@ngfi/angular';

import { ForgotPasswordModalComponent } from '../../modals/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  loginForm: FormGroup;
  isLogin: boolean;

  constructor(
    private _authService: AuthService,
    private _dialog: MatDialog,
    private _analytics: EventLogger,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  get isFormValid () {
    return this.loginForm.valid;
  }

  // When user clicks enter, try log in.
  detectEnter(event: any) {
    if (event.key === 'Enter') this.loginUser();
  }

  loginUser(): void {
    this.isLoading = true;

    if (this.isFormValid) {
      const { email, password } = this.loginForm.value;

      this._authService
        .loginWithEmailAndPassword(email as string, password as string)
        .then(() => this._analytics.logEvent('login'))
        .catch((error: FirebaseError) => {
          this._analytics.logEvent('login_error', { errorMsg: error });
          
          // replace error message with toast on AuthService once fixed
          // The error above comes from the toast failing(once login is false)
          this.loginForm.setErrors({ invalid_email: 'Something went Wrong' });
        });
    } else {
      this.loginForm.setErrors({ invalid_details: 'Invalid Details' });
    }

    this.isLoading = false;
  }

  forgotPass() {
    this._dialog.open(ForgotPasswordModalComponent, {
      width: '500px',
    });
  }

  toggleMode = () => (this.isLogin = !this.isLogin);

  loginGoogle() {
    return this._authService.loadGoogleLogin();
  }

  /** Facebook Login */
  loginFacebook() {
    return this._authService.loadFacebookLogin();
  }

  /** Microsoft Login */
  loginMicrosoft() {
    return this._authService.loadMicrosoftLogin();
  }
}
