import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { User } from '@iote/bricks';
import { UserStore } from '@app/state/user';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.page.component.html',
  styleUrls: ['./auth.page.component.scss']
})
export class AuthPageComponent implements OnInit, OnDestroy
{
  isLoading = true;
  user$: Observable<User>;
  isLogin = true;

  private _userSubscr : Subscription;

  constructor(userService: UserStore,
              private _router: Router)
  {
    this.user$ = userService.getUser();
  }

  ngOnInit()
  {
    this._userSubscr = this.user$.subscribe(user =>
    {
      if(user != null)
        this._router.navigate(['/home']);

      else
        this._router.navigate(['/auth', 'login']);

      this.isLoading = false
    });
  }

  ngOnDestroy()
  {
    if(this._userSubscr)
      this._userSubscr.unsubscribe();
  }

  toggleMode()
  {
    this.isLogin = !this.isLogin;

    if(this.isLogin)
    {
      this._router.navigate(['/auth/login']);
    }
    else {
      this._router.navigate(['/auth/register']);
    }
  }

}
