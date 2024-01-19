import { Component, ElementRef, HostListener, ViewChild, Input, OnInit, ViewContainerRef, ChangeDetectorRef, ComponentRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkPortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { BlockPortalService } from '@app/features/convs-mgr/stories/editor';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { SidemenuToggleService } from '@app/elements/layout/page-convl';
import { SideScreenToggleService } from '@app/features/convs-mgr/stories/editor';
import { VideoUploadModalComponent } from '@app/features/convs-mgr/stories/blocks/library/video-message-block'

import { ICONS_AND_TITLES } from '../../assets/icons-and-titles';
import { _DetermineBlockType } from '../../utils/block-inheritance.util';


/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-block',
  templateUrl: 'block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit 
{
  @Input() id: string;
  @Input() block: StoryBlock;
  @Input() blocksGroup: FormArray;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() viewPort: ViewContainerRef;

  @Output() deleteBlock: EventEmitter<StoryBlock> = new EventEmitter<StoryBlock>();
  @Output() copyBlock  : EventEmitter<StoryBlock> = new EventEmitter<StoryBlock>();

  type: StoryBlockTypes;
  blockFormGroup: FormGroup;

  iconClass = ''
  blockTitle = ''
  svgIcon = ''
  
  videoMessageForm: FormGroup
  

  @ViewChild(CdkPortal) portal: CdkPortal;
  ref: ComponentRef<BlockComponent>;

  constructor(private _el: ElementRef,
              private _fb: FormBuilder,
              private _blockPortalBridge: BlockPortalService,
              private sideMenu:SidemenuToggleService,
              private sideScreen:SideScreenToggleService,
              private matdialog: MatDialog,
              private _renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.type = this.block.type;

    this.iconClass = this.getBlockIconAndTitle(this.type).icon;
    this.blockTitle = this.getBlockIconAndTitle(this.type).title;
    this.svgIcon = this.getBlockIconAndTitle(this.type).svgIcon;
 
    this.blockFormGroup = _DetermineBlockType(this.block, this.type, this._fb) as FormGroup;

    if(this.blocksGroup && this.blockFormGroup)
      this.blocksGroup.push(this.blockFormGroup);
    else 
      console.warn('Cannot determine block type!');
  }

  getBlockIconAndTitle(type: number) {
    return ICONS_AND_TITLES[type];
  }

  highLight() {
    // const endpoint = document.querySelector('.jtk-endpoint');
    const comp = document.getElementById(this.id) as HTMLElement
    this._renderer.setStyle(comp, 'z-index', '2')
  }

  removeHighlight(){
    const comp = document.getElementById(this.id) as HTMLElement
    this._renderer.setStyle(comp, 'z-index', '1')
  }
  /**
   * Track and update coordinates of block and update them in data model.
   */
  @HostListener('mouseout', ['$event']) // Mouseout always happens after the drag (though it also hapens a lot more but not enough for perf issues)
  onDragEnd() {
    const style = this._el.nativeElement.getAttribute('style');

    const left = this._getPosFromStyle(style, 'left');
    const top = this._getPosFromStyle(style, 'top');

    // Update block data model (for saving and loading)
    this.block.position = {
      x: left ? left : this.block.position.x,
      y: top ? top : this.block.position.y
    };

    this.blockFormGroup.patchValue({ position: this.block.position });
  }

  /**
   * Fn which gets the block position from the style element.
   * jsPlumb sets the element position on the attribute style param during drag. */
  private _getPosFromStyle(style: string, pos: 'left' | 'top'): number | false {
    const idx = style.indexOf(pos);
    if (idx >= 0) {
      const start = idx + pos.length + 2; // Start position of the number we want to read is +2 since normal str is e.g. 'left: ' so left = pos.lenght and +2 = ': '
      const end = style.indexOf('px', start);

      const posStr = style.substring(start, end);
      const val = parseInt(posStr);

      return !isNaN(val) ? val : false;
    }
    return false;
  }

  // TODO: Use proper inheritance instead of firing from here
  editBlock() 
  {   
    // Special case - Video input via modal
    if (this.type === StoryBlockTypes.VideoInput) {
      this.matdialog.open(VideoUploadModalComponent, {
        data: { videoMessageForm: this.blockFormGroup },
      });

      return;
    }
   
    // Normal case - open side menu
    this.sideMenu.toggleExpand(false)
    this.sideScreen.toggleSideScreen(true)
    this._blockPortalBridge.sendFormGroup(this.blockFormGroup, this.blockTitle);  
  }

  copyMe() {
    this.copyBlock.emit(this.block);
  }
  handleDeleteEndStoryAnchor(event:any){
    this.deleteMe();
  }

  deleteMe() 
  {
    this.deleteBlock.emit(this.block);
  }

  //
  // SECTION BOILERPLATE
  //  Declare block types for interpretation by ngSwitchCase in the frontend

  messagetype = StoryBlockTypes.TextMessage;
  imagetype = StoryBlockTypes.Image;
  nametype = StoryBlockTypes.Name;
  emailtype = StoryBlockTypes.Email;
  phonetype = StoryBlockTypes.PhoneNumber;
  questiontype = StoryBlockTypes.QuestionBlock;
  locationtype = StoryBlockTypes.Location;
  audioType = StoryBlockTypes.Audio;
  videoType = StoryBlockTypes.Video;
  stickerType = StoryBlockTypes.Sticker;
  listType = StoryBlockTypes.List;
  documentType = StoryBlockTypes.Document;
  replyType = StoryBlockTypes.Reply;
  jumpType = StoryBlockTypes.JumpBlock;
  failType = StoryBlockTypes.FailBlock;
  imageinputType =  StoryBlockTypes.ImageInput
  locationInputType =  StoryBlockTypes.LocationInputBlock;
  imageInputType =  StoryBlockTypes.ImageInput;
  audioInputType =  StoryBlockTypes.AudioInput;
  videoInputType = StoryBlockTypes.VideoInput;
  webhookType =  StoryBlockTypes.WebhookBlock;
  endStoryAnchor = StoryBlockTypes.EndStoryAnchorBlock;
  openQuestiontype = StoryBlockTypes.OpenEndedQuestion;
  keywordJumpType = StoryBlockTypes.keyword;
  eventType = StoryBlockTypes.Event;
  assessmentBrickType= StoryBlockTypes.Assessment;
  conditionalBlockType = StoryBlockTypes.Conditional;
  CMI5BlockType = StoryBlockTypes.CMI5Block;
}
