import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, switchMap } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';
import { StoryStateService } from '@app/state/convs-mgr/stories';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

@Component({
  selector: 'app-module-page',
  templateUrl: './module-page.component.html',
  styleUrls: ['./module-page.component.scss'],
})
export class ModulePageComponent implements OnInit {
  title: string;
  breadcrumbs: Breadcrumb[] = [];

  parentModule$: Observable<BotModule>;
  stories$: Observable<Story[]>;
  org$: Observable<Organisation>;

  loading = true;
  showAllCourses = false;

  constructor(
    private _org$$: ActiveOrgStore,
    private _storiesServ$$: StoryStateService,
    private _botModServ$$: BotModulesStateService,
    private _route$: ActivatedRoute,
    private _router$$: Router
  ) {
    this.breadcrumbs = [HOME_CRUMB(_router$$, true)];
  }

  ngOnInit(): void {
    this.org$ = this._org$$.get();
  
    this.stories$ = this._route$.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') as string;
        this.parentModule$ = this._botModServ$$.getBotModuleById(id) as Observable<BotModule>;
        return this._storiesServ$$.getStoriesFromParentModule(id)
      })
    );
  }
}
