import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { User } from '@iote/bricks';
import { AuthService } from '@ngfi/angular';

import { UserStore } from '@app/state/user';
import { TranslateService } from '@ngfi/multi-lang';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.page.component.html',
  styleUrls: ['./auth.page.component.scss']
})
export class AuthPageComponent implements OnInit, OnDestroy
{
  isLoading = true;
  user$: Observable<User>;
  userHasAccess: boolean = false;

  isLogin = true;
  lang = 'en';

  private _userSubscr : Subscription;

  constructor(userService: UserStore,
              private _authService: AuthService,
              private _translateService: TranslateService,
              private _router$$: Router
  ) {
    this.user$ = userService.getUser();
  }

  ngOnInit()
  {
    this.lang = this._translateService.initialise();
    this._userSubscr = this.user$.subscribe(user =>
    {
      if (user != null) {
        if (user.roles.access == true) {
          this.userHasAccess = true;
          const userDetails: any = user.profile;
          if (userDetails.activeOrg && userDetails.orgIds && userDetails.activeOrg != '' && userDetails.orgIds.length > 0) {
            this._router$$.navigate(['/home']);
          } else {
            this._router$$.navigate(['/orgs']);
          }
        }
      } else {
        this._router$$.navigate(['/auth/login']);
      }
      this.isLoading = false;
    });
  }

  logInWithGoogle() {
    return this._authService.loadGoogleLogin();
  }

  logInWithFaceBook() {
    return this._authService.loadFacebookLogin();
  }

  createAccount() {
    
  }

  ngOnDestroy()
  {
    if(this._userSubscr)
      this._userSubscr.unsubscribe();
  }

  toggleMode()
  {
    this.isLogin=false;

    if(!this.isLogin)
    {
      console.log(this.isLogin);
      this._router$$.navigate(['/auth/register']);
    }
  }


  toggleModeLogin(){

    this.isLogin=true;

    if(this.isLogin){
      this._router$$.navigate(['/auth/login']);
    }
  }

  setLang(lang: 'en' | 'fr')
  {
    this._translateService.setLang(lang);
  }

}
