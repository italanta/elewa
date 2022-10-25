import { Component} from '@angular/core';
import { Observable } from 'rxjs';


import { Router } from '@angular/router';

import { User } from '@iote/bricks';
import { UserService, AuthService} from '@ngfi/angular';

@Component({
  selector: 'app-app-logout',
  templateUrl: './app-logout.component.html',
  styleUrls: ['./app-logout.component.css'],
})
export class AppLogoutComponent  {
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
