import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Story } from '@app/model/convs-mgr/stories/main';
import { StoriesStore } from '@app/state/convs-mgr/stories';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';


@Component({
  selector: 'convl-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePageComponent implements OnDestroy
{
  private _sb = new SubSink();

  title: string;

  breadcrumbs: Breadcrumb[] = [];

  stories$: Observable<Story[]>;
  org$: Observable<Organisation>;

  loading = true;

  constructor(
              private _stories$$: StoriesStore,
              private _router: Router,
              )
  {
    this.breadcrumbs = [HOME_CRUMB(this._router, true)];
    this.stories$ = this._stories$$.get();
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
