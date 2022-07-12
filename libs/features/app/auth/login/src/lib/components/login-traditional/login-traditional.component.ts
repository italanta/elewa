import { Component } from '@angular/core';
import { EventLogger } from '@iote/bricks-angular';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '@ngfi/angular';
import { ForgotPasswordModal } from '../../modals/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login-traditional',
  templateUrl: './login-traditional.component.html',
  styleUrls: ['./login-traditional.component.scss']
})
export class TraditionalLoginComponent
{
  isLoading: boolean;
  email: string;
  password: string;

  constructor(private _dialog: MatDialog,
              private _analytics: EventLogger,
              private _authService: AuthService)
  {  }

  validateLoginCred = () => this.email && this.password;

  // When user clicks enter, try log in.
  detectEnter = (event) => (event.key === "Enter") ? this.loginUser() : 'noop';

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
          .open(ForgotPasswordModal, {
            width: '500px'
          });
  }

}
