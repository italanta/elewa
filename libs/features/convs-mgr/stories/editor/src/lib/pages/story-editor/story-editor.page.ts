import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, filter, take } from 'rxjs';

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

  pageName: string;

  story: Story;
  breadcrumbs: Breadcrumb[] = [];

  loading = new BehaviorSubject<boolean>(true);
  frame: StoryEditorFrame;

  constructor(private _story$$: ActiveStoryStore,
              private _cd: ChangeDetectorRef,
              _router: Router)
  {
    this._story$$.get().subscribe(
      (story: Story) => {
        this.story = story;
        this.pageName = 'Story overview :: ' + story.name;

        this.breadcrumbs = [HOME_CRUMB(_router), STORY_EDITOR_CRUMB(_router, story.id, story.name, true)];
        this.loading.next(false);
      }
    ); 
  }

  onFrameViewLoaded(frame: StoryEditorFrame)
  {
    this.frame = frame;

    // After both frame AND data are loaded (hence the subscribe), draw frame blocks on the frame.
    this._sb.sink = 
      this.loading.pipe(filter(loading => !loading),
                        take(1))
            .subscribe(() => 
              this.frame.init(this.story)
            );
      
    this._cd.detectChanges();
  }

  /** Save the changes made in the data model. */
  save() {
    // this.frame.
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
