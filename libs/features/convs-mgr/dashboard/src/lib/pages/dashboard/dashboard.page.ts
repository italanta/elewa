import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { UserStore } from '@elewa/state/user';
import { EleUser } from '@elewa/model/user';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit
{
  isLoading = true;
  user$: Observable<EleUser>;

  selectVal = 'Onboarding';

  constructor(userService: UserStore,
              private _router: Router)
  {
    this.user$ = userService.getUser();
  }

  ngOnInit()
  {

  }

  onChangeGraph(evt) {
    debugger;
  }

  navToChats = (type: string) => this._router.navigate(['/chats']);
  navToSales = () => this._router.navigate(['/sales']);
}
