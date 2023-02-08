import { ChangeDetectorRef, Component, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { FormControl, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { BehaviorSubject, filter, Observable } from 'rxjs';

import { BrowserJsPlumbInstance, newInstance } from '@jsplumb/browser-ui';

import { Breadcrumb, Logger } from '@iote/bricks-angular';

import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';

import { HOME_CRUMB, STORY_EDITOR_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

import { BlockPortalService } from '../../providers/block-portal.service';
import { StoryEditorFrame } from '../../model/story-editor-frame.model';
import { AddBotToChannelModal } from '../../modals/add-bot-to-channel-modal/add-bot-to-channel.modal';

import { getActiveBlock } from '../../providers/fetch-active-block-component.function';

@Component({
  selector: 'convl-story-editor-page',
  templateUrl: './story-editor.page.html',
  styleUrls: ['./story-editor.page.scss']
})
export class StoryEditorPageComponent implements OnInit, OnDestroy {
  private _sb = new SubSink();
  portal$: Observable<TemplatePortal>;
  activeComponent: ComponentPortal<any>
  activeBlockForm: FormGroup
  
  opened: boolean;

  pageName: string;

  state: StoryEditorState;
  breadcrumbs: Breadcrumb[] = [];

  loading = new BehaviorSubject<boolean>(true);
  frame: StoryEditorFrame;

  stateSaved: boolean = true;

  //TODO @CHESA LInk boolean to existence of story in DB
  storyHasBeenSaved: boolean = false;

  zoomLevel: FormControl = new FormControl(100);
  frameElement: HTMLElement;
  frameZoom: number = 1;
  frameZoomInstance: BrowserJsPlumbInstance;

  constructor(private _editorStateService: StoryEditorStateService,
              private _dialog: MatDialog,
              private _cd: ChangeDetectorRef,
              private _logger: Logger,
              private _blockPortalService: BlockPortalService,
              _router: Router
  ) {
    this._editorStateService.get()
      .subscribe((state: StoryEditorState) => {
        this._logger.log(() => `Loaded editor for story ${state.story.id}. Logging state.`)
        this._logger.log(() => state);

        this.state = state;
        this.pageName = `Story overview :: ${state.story.name}`;

        const story = state.story;
        this.breadcrumbs = [HOME_CRUMB(_router), STORY_EDITOR_CRUMB(_router, story.id, story.name, true)];
        this.loading.next(false);
      }
      );
  }

  ngOnInit() {
    this._sb.sink = this._blockPortalService.portal$.subscribe((blockForm: FormGroup) => {
      if (blockForm) {
        const comp = getActiveBlock(blockForm.value.type);
        this.activeBlockForm = blockForm
        this.activeComponent = new ComponentPortal(comp);
        this.opened = true;
      }
    });
  }

  /**
  * Called when the portal component is rendered. Passes formGroup as an input to newly rendered Block Component
  * @param ref represents a component created by a Component factory.
  */
  onBlockComponentRendering(ref: any) {
    ref = ref as ComponentRef<any>
    ref.instance['form'] = this.activeBlockForm
  }

  /**  Detach and close Block Edit form */
  onClose() {
    this.activeComponent?.detach()
    this.opened = false;
  }

  onFrameViewLoaded(frame: StoryEditorFrame) {
    this.frame = frame;

    // After both frame AND data are loaded (hence the subscribe), draw frame blocks on the frame.
    this._sb.sink =
      this.loading.pipe(filter(loading => !loading))
        .subscribe(() => {
          this.frame.init(this.state);
          this.setFrameZoom();
        }
        );

    this._cd.detectChanges();
  }

  setFrameZoom() {
    this.frameElement = document.getElementById('editor-frame')!;
    this.frameZoomInstance = newInstance({
      container: this.frameElement
    })
    this.zoom(this.frameZoom);
  }

  increaseFrameZoom() {
    if (this.zoomLevel.value <= 100) this.zoom(this.frameZoom += 0.03);
  }

  decreaseFrameZoom() {
    if (this.zoomLevel.value > 25) this.zoom(this.frameZoom -= 0.03);
  }

  zoom(frameZoom: number) {
    this.frameElement.style.transform = `scale(${frameZoom})`;
    this.frame.jsPlumbInstance.setZoom(frameZoom);
    this.zoomLevel.setValue(Math.round(frameZoom / 1 * 100));
  }

  zoomChanged(event: any) {
    let z = event.target.value / 100;
    this.zoomLevel.setValue(z);
    this.zoom(z);
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

    // remove duplicate jsplumb connections
    this.state.connections = connections.filter((con) => !con.targetId.includes('jsPlumb'));

    this._editorStateService.persist(this.state)
        .subscribe((success) => {
          if (success) {
            this.stateSaved = true;
            this.opened = false;
            this.storyHasBeenSaved = true;
          }
        });
  }

  addToChannel() {
    this._dialog.open(AddBotToChannelModal, {
      width: '550px'
    })

  }

  ngOnDestroy() {
    this._editorStateService.flush();
    this._sb.unsubscribe();
  }
}
