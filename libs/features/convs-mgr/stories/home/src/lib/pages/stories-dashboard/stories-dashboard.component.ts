import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { BreadcrumbService } from '@app/elements/layout/ital-bread-crumb';
import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';

@Component({
  selector: 'italanta-apps-stories-dashboard',
  templateUrl: './stories-dashboard.component.html',
  styleUrls: ['./stories-dashboard.component.scss'],
})
export class StoriesDashboardComponent implements OnInit {
  breadcrumbs$: Observable<iTalBreadcrumb[]>;

  title: string;

  bots$: Observable<Bot[]>;

  loading = true;
  showAllCourses = false;

  constructor(
    private _botsServ$$: BotsStateService,
    private _breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbs$ = this._breadcrumbService.breadcrumbs$;
  }

  ngOnInit(): void {
    this.bots$ = this._botsServ$$.getBots();
  }
}
