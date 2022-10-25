import { Component } from '@angular/core';
import { Observable } from 'rxjs';


import { Router } from '@angular/router';

import { User } from '@iote/bricks';
import { UserService, AuthService} from '@ngfi/angular';


@Component({
  selector: 'app-app-user-menu',
  templateUrl: './app-user-menu.component.html',
  styleUrls: ['./app-user-menu.component.css'],
  
})
export class AppUserMenuComponent  {
  user$: Observable<User>;

  constructor(userService: UserService<User>,
              private _router: Router,
              private _authService: AuthService)
  {
    this.user$ = userService.getUser();
  }

  isAdmin = (user: any) => user.roles.admin;
  toAdmin = () => this._router.navigate(['admin', 'translate']);

  logout() {
    this._authService.signOut('/auth/login');
  }
}
