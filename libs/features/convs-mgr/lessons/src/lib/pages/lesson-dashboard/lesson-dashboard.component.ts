import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { Bot } from '@app/model/convs-mgr/bots';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';


@Component({
  selector: 'app-lesson-dashboard',
  templateUrl: './lesson-dashboard.component.html',
  styleUrls: ['./lesson-dashboard.component.scss'],
})
export class LessonDashboardComponent implements OnInit {
  title: string;
  breadcrumbs: Breadcrumb[] = [];

  bots$: Observable<Bot[]>;
  org$: Observable<Organisation>;

  loading = true;
  showAllCourses = false;

  constructor(
    private _org$$: ActiveOrgStore,
    private _botsServ$$: BotsStateService,
    private _router$$: Router
  ) {
    this.breadcrumbs = [HOME_CRUMB(_router$$, true)];
  }

  ngOnInit(): void {
    this.org$ = this._org$$.get();
    this.bots$ = this._botsServ$$.getBots();
  }
}
