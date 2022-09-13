import { Component } from '@angular/core';
import { UserService, AuthService} from '@ngfi/angular';
import { User } from '@iote/bricks';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-app-logout',
  templateUrl: './app-logout.component.html',
  styleUrls: ['./app-logout.component.scss'],
})
export class AppLogoutComponent  {
  user$: Observable<User>;

  constructor(userService: UserService<User>, private _authService: AuthService) {}


  logout() {
    this._authService.signOut('/auth/login');
  }
}