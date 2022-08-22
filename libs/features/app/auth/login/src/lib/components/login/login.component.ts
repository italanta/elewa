import { Form, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventLogger } from '@iote/bricks-angular';

import { AuthService } from '@ngfi/angular';
import { TranslateService } from '@ngfi/multi-lang';
import { ForgotPasswordModalComponent } from '../../modals/forgot-password-modal/forgot-password-modal.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit
{

  isLoading: boolean;
  email: string;
  password: string;

  // isLoading: boolean;
  isLogin = true;
  lang = 'en';

  constructor(private _translateService: TranslateService,
              private _authService: AuthService,
              private _dialog: MatDialog,
              private _analytics: EventLogger)
  {  }

  ngOnInit()
  {
    this.lang = this._translateService.initialise();
  }

  validateLoginCred = () => this.email && this.password;

  // When user clicks enter, try log in.
  detectEnter = (event: any) => (event.key === "Enter") ? this.loginUser() : 'noop';

  loginUser()
  {
    this.isLoading = true;

    if(this.validateLoginCred())
      this._authService.loginWithEmailAndPassword(this.email, this.password)
                      .then(()=> this._analytics.logEvent('login'))
                      .catch((error) => { this.isLoading = false;
                                          this._analytics.logEvent('login_error', {"errorMsg": error})
                                        });
  }

  forgotPass() {
    this._dialog
          .open(ForgotPasswordModalComponent, {
            width: '500px'
          });
  }

  toggleMode = () => this.isLogin = ! this.isLogin;


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

  setLang(lang: 'en' | 'fr')
  {
    this._translateService.setLang(lang);
  }
}
