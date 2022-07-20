import { Component, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SubSink } from 'subsink';

import { Breadcrumb } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

import { HOME_CRUMB, STORY_EDITOR_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

@Component({
  selector: 'convl-story-editor-page',
  templateUrl: './story-editor.page.html',
  styleUrls: ['./story-editor.page.scss']
})
export class StoryEditorPageComponent implements OnDestroy
{
  private _sb = new SubSink();

  title: string;

  story: Story;
  breadcrumbs: Breadcrumb[] = [];

  loading = true;

  constructor(private _story$$: ActiveStoryStore,
              _router: Router)
  {
    this._story$$.get().subscribe(
      (story: Story) => {
        this.story = story;

        this.breadcrumbs = [HOME_CRUMB(_router), STORY_EDITOR_CRUMB(_router, story.id, story.name, true)];
        this.loading = false;
      }
    ); 
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
