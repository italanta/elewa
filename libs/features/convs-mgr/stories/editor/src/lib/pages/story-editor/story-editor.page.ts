import { ChangeDetectorRef, Component, OnInit, OnDestroy, ComponentRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { FormControl, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';

import { Breadcrumb, Logger } from '@iote/bricks-angular';

import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';

import { SidemenuToggleService } from '@app/elements/layout/page-convl';
import { HOME_CRUMB, STORY_EDITOR_CRUMB } from '@app/elements/nav/convl/breadcrumbs';

import { ToastMessageTypeEnum, ToastStatus } from '@app/model/layout/toast';
import { StoryError } from '@app/model/convs-mgr/stories/main';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';

import { SideScreenToggleService } from '../../providers/side-screen-toggle.service';
import { BlockPortalService } from '../../providers/block-portal.service';
import { getActiveBlock } from '../../providers/fetch-active-block-component.function';
import { SaveStoryService } from '../../providers/save-story.service';

import { StoryEditorFrameComponent } from '../../components/editor-frame/editor-frame.component';
import { AddBotToChannelModal } from '../../modals/add-bot-to-channel-modal/add-bot-to-channel.modal';

@Component({
  selector: 'convl-story-editor-page',
  templateUrl: './story-editor.page.html',
  styleUrls: ['./story-editor.page.scss']
})
export class StoryEditorPageComponent implements OnInit, OnDestroy 
{
  private _sb = new SubSink();
  portal$: Observable<TemplatePortal>;
  activeComponent: ComponentPortal<any>
  activeBlockForm: FormGroup
  activeBlockTitle: string

  errors: StoryError[] = [];
  shownErrors: StoryError[] = [];
  toastType: ToastStatus = {type: ToastMessageTypeEnum.Error};

  @ViewChild('storyEditorFrame') storyEditorFrame: StoryEditorFrameComponent;

  opened: boolean;

  pageName: string;
  isSideScreenOpen:boolean;

  state: StoryEditorState;
  breadcrumbs: Breadcrumb[] = [];

  loading = new BehaviorSubject<boolean>(true);
  frame: StoryEditorFrame;

  stateSaved = true;

  hasEmptyFields = false;
  //TODO @CHESA LInk boolean to existence of story in DB
  storyHasBeenSaved = false;

  zoomLevel: FormControl = new FormControl({ value: 100, disabled: true});

  constructor(private _editorStateService: StoryEditorStateService,
              private _blockPortalService: BlockPortalService,
              private _saveStory: SaveStoryService,

              private _sideMenu: SidemenuToggleService,
              private sideScreen: SideScreenToggleService,

              private _dialog: MatDialog,
              private _cd: ChangeDetectorRef,
              private renderer: Renderer2,
              _router: Router,

              private _logger: Logger) 
  {
    // Make sure screen is always closed on loading editor
    this._sideMenu.toggleExpand(false);

    // Load the editor
    this._editorStateService.get().pipe(take(1))
      .subscribe((state: StoryEditorState) =>
      {
        this._logger.log(() => `Loaded editor for story ${state.story.id}. Logging state.`)
        this._logger.log(() => state);

        this.state = state;
        this.pageName = `Story overview :: ${state.story.name}`;

        const story = state.story;
        this.breadcrumbs = [HOME_CRUMB(_router), STORY_EDITOR_CRUMB(_router, story.id, story.name as string, true)];
        this.loading.next(false);
      });
    }

    ngOnInit()
    {
      this._sb.sink 
        = this.sideScreen.sideScreen$
            .subscribe((isOpen) => this.isSideScreenOpen = isOpen);

      this._sb.sink 
        = this._blockPortalService.portal$.subscribe((blockDetails) => 
      {
        if (blockDetails.form) {
          const comp = getActiveBlock(blockDetails.form.value.type);
          this.activeBlockForm = blockDetails.form
          this.activeBlockTitle = blockDetails.title
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
    ref.instance['form'] = this.activeBlockForm;
    ref.instance['title'] = this.activeBlockTitle;
  }

  /**  Detach and close Block Edit form */
  onClose() {
    if (this.activeComponent && this.activeComponent.isAttached) {
      this.activeComponent?.detach()
      this.opened = false;
    }
  }

  onFrameViewLoaded(frame: StoryEditorFrame) {
    this.frame = frame;

    // After both frame AND data are loaded (hence the subscribe), draw frame blocks on the frame.
    this._sb.sink =
      this.loading.pipe(filter(loading => !loading))
        .subscribe(() => {
          this.frame.init(this.state);
        }
        );

    this._cd.detectChanges();
  }
 
  /** 
   * ==== CORE FEATURE ====
   * 
   * Save the changes made in the data model.
   */
  save(overrideValidators = false) 
  {
    this.errors = this.shownErrors = [];
    this.stateSaved = false;
   
    // Get updated blocks from the frame-form
    this.state.blocks = [...this.frame.blocksArray.getRawValue()];
    this.state.story.blocksCount = this.state.blocks.length;
   
    try {
      this._sb.sink =
        this._saveStory.saveStory(this.state, this.frame, !overrideValidators)
          .subscribe((success) => 
          {
            if (success) 
            {
              this.stateSaved = true;
              this.opened = false;
              this.storyHasBeenSaved = true;
            }
          // TODO: Handle failed saves
          });
    }
    // If there are errors, inform the user and give control to the user.
    catch (e)
    {
      this.errors = e as StoryError[];
      this.shownErrors = this.errors.slice(0,2);
      this.stateSaved = true;
    }
  }

  /** After providing user feedback, the user can decide to save even with errors. */
  saveWithErrors() {
    return this.save(true);
  }

  //
  // END SAVE
  //

  addToChannel() {
    // this.checkStoryErrors();
    this._dialog.open(AddBotToChannelModal, {
      width: '550px'
    })

  }

  toggleSidenav() {
    this.sideScreen.toggleSideScreen(!this.isSideScreenOpen)
    this.onClose()
  }

  closeErrorToast(error: StoryError){
    this.errors = this.errors.filter(
      (item: StoryError) => {
        return item.blockId !== error.blockId
      }
    )
    this.shownErrors = this.errors.slice(0,2)
  }

  scrollTo(error: StoryError) {
    switch (error.blockId) {
      case 'story-end-anchor':
      case this.state.story.id:
        this.scrollToBlock(error.blockId);
        break;
  
      default: 
      {
        const block = this.state.blocks.find(obj => obj.id === error.blockId);
        if (block) {
          this.scrollToBlock(block.id as string);
        }
      }
        break;
    }
  }
  
  scrollToBlock(blockId: string) {
    const editorFrame = document.getElementById('viewport');
    const targetSection = document.getElementById(`${blockId}`);
    
    if (editorFrame && targetSection) {

      // Limit the scrolling to only the viewport by binding it
      const rect = targetSection.getBoundingClientRect();
      const editorRect = editorFrame.getBoundingClientRect();
      
      // Calculate the scroll positions
      const scrollTop = editorFrame.scrollTop + rect.top - editorRect.top - (editorRect.height - rect.height) / 2;
      const scrollLeft = editorFrame.scrollLeft + rect.left - editorRect.left - (editorRect.width - rect.width) / 2;
      
      // Scroll to the target block
      editorFrame.scrollTo({
        top: Math.max(0, scrollTop),  // Ensure the scrollTop value is not negative
        left: Math.max(0, scrollLeft),  // Ensure the scrollLeft value is not negative
        behavior: 'smooth'
      });
      
      // Set the border style
      this.renderer.setStyle(targetSection, 'border', '2px solid red');
      
      // Remove the border style after 5 seconds
      setTimeout(() => {
        this.renderer.removeStyle(targetSection, 'border');
      }, 5000);
    }
  }
  
  
  // Section - Zoom

  increaseZoom() {
    if(this.zoomLevel.value >= 100) 
      return;

    const zoom = this.storyEditorFrame.increaseFrameZoom();
    return this.setZoom(zoom * 100, true);
  }

  decreaseZoom() {
    if(this.zoomLevel.value <= 25) 
      return; 

    const zoom = this.storyEditorFrame.decreaseFrameZoom();
    return this.setZoom(zoom * 100, true);
  }
 
  /**
   * 
   * @param val - Zoom value to set
   * @param avoidUpdate - In case the call comes from internal ops such as increaseZoom or decreaseZoom,
   *                          avoid updating the underlying structure as it already happened.
   */
  setZoom(val: number, avoidUpdate = false) 
  {
    if(val >= 25 && val <= 100)
    {
      this.zoomLevel.setValue(val);
      if(!avoidUpdate) 
        this.storyEditorFrame.setFrameZoom(val / 100);
    }
  }

  ngOnDestroy() {
    this._editorStateService.flush();
    this._sb.unsubscribe();
  }
}
