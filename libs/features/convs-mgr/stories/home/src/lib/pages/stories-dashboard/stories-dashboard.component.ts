import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'italanta-apps-stories-dashboard',
  templateUrl: './stories-dashboard.component.html',
  styleUrls: ['./stories-dashboard.component.scss'],
})
export class StoriesDashboardComponent implements OnInit {

  private _sb = new SubSink();

  title: string;

  breadcrumbs: Breadcrumb[] = [];

  stories$: Observable<Story[]>;
  org$: Observable<Organisation>;

  loading = true;

  constructor(private _org$$: ActiveOrgStore,
              private _stories$$: StoriesStore,
              private _router$$: Router,
              private dialog : MatDialog
  )
  {
    this.breadcrumbs = [HOME_CRUMB(_router$$, true)];
    this.org$ = _org$$.get();
    this.stories$ = this._stories$$.get();
  }

  ngOnInit(): void {}

  openCreateDialog(){
    this.dialog.open(CreateBotModalComponent, {
      data: {
        isEditMode: false,
      },
      minHeight: 'fit-content',
      minWidth: '600px'
    });
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
