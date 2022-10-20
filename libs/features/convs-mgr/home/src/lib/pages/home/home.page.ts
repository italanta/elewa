import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Story } from '@app/model/convs-mgr/stories/main';

import { ActiveOrgStore } from '@app/state/organisation';
import { StoriesStore } from '@app/state/convs-mgr/stories';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

import { CreateBotModalComponent } from '../../modals/create-bot-modal/create-bot-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'convl-home',
  templateUrl: './home.page.html',
  // standalone: true,
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./home.page.scss'],
})
export class HomePageComponent implements OnDestroy {
  private _sb = new SubSink();

  title: string;

  breadcrumbs: Breadcrumb[] = [];

  stories$: Observable<Story[]>;
  org$: Observable<Organisation>;

  loading = true;

  constructor(
    private _org$$: ActiveOrgStore,
    private _stories$$: StoriesStore,
    _router: Router,
    private dialog: MatDialog
  ) {
    this.breadcrumbs = [HOME_CRUMB(_router, true)];
    this.org$ = _org$$.get();
    this.stories$ = this._stories$$.get();
  }

  ngOnDestroy() {
    this._sb.unsubscribe();
  }

  openDialog() {
    this.dialog.open(CreateBotModalComponent);
  }
}
