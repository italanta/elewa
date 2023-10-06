import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, switchMap } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

@Component({
  selector: 'italanta-apps-bot-page',
  templateUrl: './bot-page.component.html',
  styleUrls: ['./bot-page.component.scss'],
})
export class BotPageComponent implements OnInit {
  title: string;
  breadcrumbs: Breadcrumb[] = [];

  botModules$: Observable<BotModule[]>;
  org$: Observable<Organisation>;

  loading = true;
  showAllCourses = false;

  constructor(
    private _org$$: ActiveOrgStore,
    private _botModServ$$: BotModulesStateService,
    private _route$: ActivatedRoute,
    private _router$$: Router
  ) {
    this.breadcrumbs = [HOME_CRUMB(_router$$, true)];
  }

  ngOnInit(): void {
    this.org$ = this._org$$.get();
  
    this.botModules$ = this._route$.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') as string;
        return this._botModServ$$.getBotModulesFromParentBot(id) as Observable<BotModule[]>;
      })
    );
  }

  openModule() {
    this._router$$.navigate([''])
  }
}
