import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, filter } from 'rxjs';

import { Breadcrumb, Logger } from '@iote/bricks-angular';

import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';
import { BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';

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

  stateSaved: boolean = true;

  constructor(private _editorStateService: StoryEditorStateService,
              private _cStore: BlockConnectionsService,
              private _cd: ChangeDetectorRef,
              private _logger: Logger,
              _router: Router)
  {
    this._editorStateService.get()
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
      this.loading.pipe(filter(loading => !loading))
            .subscribe(() => 
              this.frame.init(this.state)
            );
      
    this._cd.detectChanges();
  }

  /** Save the changes made in the data model. */
  save() {
    this.stateSaved = false;

    let updatedState = this.state;
    updatedState.blocks = [...this.frame.blocksArray.value];

    let connections = this.frame.getJsInstance() as any[];

    console.log(connections);
    
    connections = connections.map(c => {return {
      id: c.id,
      sourceId : c.sourceId,
      targetId : c.targetId,
    }})

    this._cStore.addMultipleConnections(connections);
  
    this._editorStateService.persist(this.state)
        .subscribe((success) => {
          if (success) {
            this.stateSaved = true;
          }
        });
  }

  ngOnDestroy()
  {
    this._editorStateService.flush();
    this._sb.unsubscribe();
  }
}
