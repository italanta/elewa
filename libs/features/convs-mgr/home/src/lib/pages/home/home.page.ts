import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoriesStore } from '@app/state/convs-mgr/stories';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

import { NewStoryService } from '../../services/new-story.service';

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

  loading = true;

  constructor(private _stories$$: StoriesStore,
              _router: Router,
              private _addStory$: NewStoryService)
  {
    this.breadcrumbs = [HOME_CRUMB(_router, true)];
    this.stories$ = this._stories$$.get();
  }

  add = () => this._addStory$.add().subscribe();

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
