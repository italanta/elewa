import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { debounceTime, Observable } from 'rxjs';

import { Breadcrumb } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Story } from '@app/model/convs-mgr/stories/main';

import { ActiveOrgStore } from '@app/state/organisation';
import { StoriesStore } from '@app/state/convs-mgr/stories';

import { HOME_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

import { NewStoryService } from '../../services/new-story.service';
import { AnchorBlockService } from '@app/state/convs-mgr/stories/blocks';

import { CreateBotModalComponent } from '../../modals/create-bot-modal/create-bot-modal.component';
import { MatDialog } from '@angular/material/dialog';


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

  constructor(private _org$$: ActiveOrgStore,
              private _stories$$: StoriesStore,
              private _anchor$$: AnchorBlockService,
              _router: Router,
              private _addStory$: NewStoryService,
              private dialog : MatDialog
              )
  {
    this.breadcrumbs = [HOME_CRUMB(_router, true)];
    this.org$ = _org$$.get();
    this.stories$ = this._stories$$.get();
  }

  add () {
    this._addStory$.add().subscribe((story: Story)=>{
      let d = story
    setTimeout(() => {
      this._anchor$$.create(d.id as string)
    }, 800);
    })

  };

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }

  openDialog(){
    this.dialog.open(CreateBotModalComponent,{
      height: '480px',
      width: '600px',

    });
  }
}
