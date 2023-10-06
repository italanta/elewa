import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, switchMap } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';
import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

@Component({
  selector: 'italanta-apps-bot-page',
  templateUrl: './bot-page.component.html',
  styleUrls: ['./bot-page.component.scss'],
})
export class BotPageComponent implements OnInit {
  title: string;
  breadcrumbs: Breadcrumb[] = [];

  parentBot$: Observable<Bot>
  botModules$: Observable<BotModule[]>;
  org$: Observable<Organisation>;

  loading = true;
  showAllCourses = false;

  constructor(
    private _org$$: ActiveOrgStore,
    private _botServ$$: BotsStateService,
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
        this.parentBot$ = this._botServ$$.getBotById(id) as Observable<Bot>;
        return this._botModServ$$.getBotModulesFromParentBot(id);
      })
    );
  }

  openModule() {
    this._router$$.navigate([''])
  }
}
