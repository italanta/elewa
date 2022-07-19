import { Component, HostListener } from '@angular/core';

import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { UserStore } from '@app/state/user';
// import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'convl-nav-wrapper',
  templateUrl: './nav-wrapper.component.html',
  styleUrls: ['./nav-wrapper.component.scss']
})
export class ConlvSideNavContainerComponent
{
  user$: Observable<User>;

  opened = false;

  mode: any = 'side';

  constructor(_userService: UserStore)
  {
    this.user$ = _userService.getUser();

    this.user$.subscribe(() => this.opened = true);

    this._checkIsDesktop();
  }

  toggleSidemenu()
  {
    this.opened = !this.opened;
  }

  @HostListener('window: resize', ['$event'])
  onResize() {
    this._checkIsDesktop();
  }

  private _checkIsDesktop()
  {
    if(!window.matchMedia("(min-width: 900px)").matches)
    {
      this.mode = 'over';
      this.opened = false;
    }
    else{
      this.mode = 'side';
      this.opened = true;
    }

  }

}
