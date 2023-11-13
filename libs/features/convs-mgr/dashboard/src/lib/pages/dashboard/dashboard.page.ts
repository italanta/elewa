import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { iTalUser } from '@app/model/user';
import { UserStore } from '@app/state/user';
import { SidemenuToggleService } from '@app/elements/layout/page-convl';
// import { UserStore } from '@elewa/state/user';
// import { EleUser } from '@elewa/model/user';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit
{
  isLoading = true;
  user$: Observable<iTalUser>;

  selectVal = 'Onboarding';

  constructor(userService: UserStore,
              private _sideMenu: SidemenuToggleService,
              private _router: Router)
  {
    this.user$ = userService.getUser();
  }

  ngOnInit()
  {
    // On dashboard load, always expand the side menu
    this._sideMenu.toggleExpand(true);
  }

  onChangeGraph(evt: any) {
  }

  navToChats = (type: string) => this._router.navigate(['/chats']);
  navToSales = () => this._router.navigate(['/sales']);
}
