import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Breadcrumb } from '@iote/bricks-angular';


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


  loading = true;

  constructor(
              _router: Router,
              private _addStory$: NewStoryService)
  {
    this.breadcrumbs = [HOME_CRUMB(_router, true)];
  }

  add = () => this._addStory$.add().subscribe();

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
