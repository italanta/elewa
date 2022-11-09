import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, filter } from 'rxjs';

import { Breadcrumb, Logger } from '@iote/bricks-angular';

import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';

import { HOME_CRUMB, STORY_EDITOR_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';
import { MatDialog } from '@angular/material/dialog';
import { AddBotToChannelModal } from '../../modals/add-bot-to-channel-modal/add-bot-to-channel.modal';

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

  //TODO @CHESA LInk boolean to existence of story in DB
  storyHasBeenSaved:boolean = false;

  constructor(private _editorStateService: StoryEditorStateService,
              private _dialog: MatDialog,
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

    //TODO: compare old state connections to updated connections
    // from getConnections()
    // find a jsPlumb types library to replace any with strict type
    let connections = this.frame.getJsPlumbConnections as any[];
    
    this.state.connections = connections;
  
    this._editorStateService.persist(this.state)
        .subscribe((success) => {
          if (success) {
            this.stateSaved = true;
            this.storyHasBeenSaved = true;
          }
        });
  }

  addToChannel(){
    this._dialog.open(AddBotToChannelModal, {
      width: '550px'
    })

  }

  ngOnDestroy()
  {
    this._editorStateService.flush();
    this._sb.unsubscribe();
  }
}
