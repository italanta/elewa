import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { Bot } from '@app/model/convs-mgr/bots';

import { BotsStateService } from '@app/state/convs-mgr/bots';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';
import { ItalBreadCrumb } from '@app/model/layout/ital-breadcrumb';

@Component({
  selector: 'italanta-apps-stories-dashboard',
  templateUrl: './stories-dashboard.component.html',
  styleUrls: ['./stories-dashboard.component.scss'],
})
export class StoriesDashboardComponent implements OnInit 
{
  breadcrumb={ icon: 'assets/icons/bot.png', paths: [{ label: 'Home', link: '' }, { label: 'Bots', link: '' }] } as ItalBreadCrumb


  title: string;
  breadcrumbs: Breadcrumb[] = [];

  bots$: Observable<Bot[]>;

  loading = true;
  showAllCourses = false;

  constructor(private _botsServ$$: BotsStateService,
              private _router$$: Router) 
  {
    this.breadcrumbs = [HOME_CRUMB(_router$$, true)];
  }

  ngOnInit(): void {
    this.bots$ = this._botsServ$$.getBots();
  }
}
