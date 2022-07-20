import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SubSink } from 'subsink';

import { Breadcrumb } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

import { HOME_CRUMB, STORY_EDITOR_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';

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
  frame: StoryEditorFrame;

  constructor(private _story$$: ActiveStoryStore,
              private _cd: ChangeDetectorRef,
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

  onFrameLoaded(frame: StoryEditorFrame)
  {
    this.frame = frame;
    this._cd.detectChanges();
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
