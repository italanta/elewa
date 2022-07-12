import { Component, Input } from '@angular/core';

import { AuthService } from '@ngfi/angular';

@Component({
  selector: 'app-login-social',
  templateUrl: './login-social.component.html',
  styleUrls: ['./login-social.component.scss']
})
export class SocialLoginComponent
{
  @Input() mode: 'row' | 'column';

  constructor(private _authService: AuthService) {  }

  // Social Login
  // --

  /** Google Login */
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
