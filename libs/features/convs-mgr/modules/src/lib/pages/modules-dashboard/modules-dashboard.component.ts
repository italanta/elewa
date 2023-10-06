import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

@Component({
  selector: 'app-modules-dashboard',
  templateUrl: './modules-dashboard.component.html',
  styleUrls: ['./modules-dashboard.component.scss'],
})
export class ModulesDashboardComponent implements OnInit {
  title: string;
  breadcrumbs: Breadcrumb[] = [];

  botModules$: Observable<BotModule[]>;
  org$: Observable<Organisation>;

  loading = true;
  showAllCourses = false;

  constructor(
    private _org$$: ActiveOrgStore,
    private _botModServ$$: BotModulesStateService,
    private _router$$: Router
  ) {
    this.breadcrumbs = [HOME_CRUMB(_router$$, true)];
  }

  ngOnInit(): void {
    this.org$ = this._org$$.get();
    this.botModules$ = this._botModServ$$.getBotModules();
  }
}
