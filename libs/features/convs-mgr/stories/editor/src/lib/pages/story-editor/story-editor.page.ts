import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, filter, take } from 'rxjs';

import { Breadcrumb, Logger } from '@iote/bricks-angular';

import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';
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

  state: StoryEditorState;
  breadcrumbs: Breadcrumb[] = [];

  loading = new BehaviorSubject<boolean>(true);
  frame: StoryEditorFrame;

  constructor(private _editorStateService: StoryEditorStateService,
              private _cd: ChangeDetectorRef,
              private _logger: Logger,
              _router: Router)
  {
    this._editorStateService.get()
                            .pipe(take(1))
        .subscribe((state: StoryEditorState) => 
        {
          this._logger.log(() => `Loaded editor for story ${state.story.id}. Logging state.`)
          this._logger.log(() => state);

          this.state = state;
          this.pageName = `Story overview :: ${ state.story.name }`;

          const story = state.story;
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
              this.frame.init(this.state)
            );
      
    this._cd.detectChanges();
  }

  /** Save the changes made in the data model. */
  save() {
    this._editorStateService.persist(this.state)
        .subscribe();
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
