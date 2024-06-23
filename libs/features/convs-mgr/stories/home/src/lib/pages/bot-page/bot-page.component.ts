import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, map, switchMap, take } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';
import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { SubSink } from 'subsink';

@Component({
  selector: 'italanta-apps-bot-page',
  templateUrl: './bot-page.component.html',
  styleUrls: ['./bot-page.component.scss'],
})
export class BotPageComponent implements OnInit 
{
  private _sbS = new SubSink();

  title: string;
  breadcrumbs: Breadcrumb[] = [];

  loading = true;
  showAllCourses = false;

  constructor(private _botServ$$: BotsStateService,
              private _route$: ActivatedRoute,
              private _router$$: Router) 
  {
    this.breadcrumbs = [HOME_CRUMB(_router$$, true)];
  }

  // Dynamic navigation to bot editor experience based on type.
  ngOnInit(): void 
  {
    this._sbS.sink = 
      this._route$.paramMap
        .pipe(
          switchMap((params) => 
          {
            const id = params.get('id') as string;
            return this._botServ$$.getBotById(id) as Observable<Bot>;
          }),
          map(bot => bot.type),
          take(1))
        .subscribe
        // Bot type determines editor experience. We navigate to the correct editor experience based on the child type.
        (botType => 
          this._router$$.navigate(['']));
  }
}
