import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventLogger } from '@iote/bricks-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '@ngfi/angular';
import { ForgotPasswordModalComponent } from '../../modals/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  email: string;
  password: string;
  loginForm: any;
  loginFailed: boolean;
  isLogin: boolean;

  // isLoading: boolean;
  isLoginFormValid(): boolean {
    return this.loginForm.valid;
  }

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

  validateLoginCred = () => this.email && this.password;

  // When user clicks enter, try log in.
  detectEnter(event: any): void {
    if (event.key === 'Enter' && this.isLoginFormValid()) {
      this.loginUser();
    }
  }
  loginUser(): void {
    this.isLoading = true;

    if (this.isLoginFormValid()) {
      const { email, password } = this.loginForm.value;

      this._authService
        .loginWithEmailAndPassword(email, password)
        .then(() => this._analytics.logEvent('login'))
        .catch((error) => {
          this.isLoading = false;
          this._analytics.logEvent('login_error', { errorMsg: error });
          this.loginFailed = true;
        });
    }
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
