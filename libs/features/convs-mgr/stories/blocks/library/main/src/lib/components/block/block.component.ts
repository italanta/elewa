import { Component, ElementRef, HostListener, ViewChild, Input, OnInit, ViewContainerRef, ChangeDetectorRef, ComponentRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CdkPortal, ComponentPortal } from '@angular/cdk/portal';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';

import { BlockPortalService } from '@app/features/convs-mgr/stories/editor';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { _CreateImageMessageBlockForm } from '../../model/image-block-form.model';
import { _CreateLocationBlockForm } from '../../model/location-block-form.model';
import { _CreateQuestionBlockMessageForm } from '../../model/questions-block-form.model';
import { _CreateTextMessageBlockForm } from '../../model/message-block-form.model';
import { _CreateNameMessageBlockForm } from '../../model/name-block-form.model';
import { _CreateEmailMessageBlockForm } from '../../model/email-block-form.model';
import { _CreatePhoneMessageBlockForm } from '../../model/phonenumber-block-form.model';
import { _CreateAudioBlockForm } from '../../model/audio-block-form.model';
import { _CreateVideoMessageBlockForm } from '../../model/video-block-form.model';
import { _CreateStickerBlockForm } from '../../model/sticker-block-form.model';
import { _CreateListBlockMessageForm } from '../../model/list-block-form.model';
import { _CreateDocumentMessageBlockForm } from '../../model/document-block-form.model';
import { _CreateReplyBlockForm } from '../../model/reply-block-form.model';
import { _CreateMultipleInputMessageBlockForm } from '../../model/multiple-input-message-block-form.model';
import { _CreateImageInputBlockForm } from '../../model/image-input-block-form.model';

import { iconsAndTitles } from '../../model/icons-and-titles';
import { _CreateJumpBlockForm } from '../../model/jump-block-form.model';
import { _CreateFailBlockForm } from '../../model/fail-block-form.model';
import { _CreateLocationInputBlockForm } from '../../model/location-input-block-form.model';
import { _CreateAudioInputBlockForm } from '../../model/audio-input-block-form.model';
import { _CreateWebhookBlockForm } from '../../model/webhook-block-form.model';
import { _CreateEndStoryAnchorBlockForm } from '../../model/end-story-anchor-block-form.model';
import { _CreateOpenEndedQuestionBlockForm } from '../../model/open-ended-question-block-form.model';
import { _CreateVideoInputBlockForm } from '../../model/video-input-block-form.model'

import { BlockInjectorService } from '../../providers/block-injector.service';

/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-block',
  templateUrl: 'block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: StoryBlock;
  @Input() blocksGroup: FormArray;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() viewPort: ViewContainerRef;

  type: StoryBlockTypes;
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
  multipleInputType = StoryBlockTypes.MultipleInput;
  failType = StoryBlockTypes.FailBlock;
  imageinputType =  StoryBlockTypes.ImageInput
  locationInputType =  StoryBlockTypes.LocationInputBlock;
  imageInputType =  StoryBlockTypes.ImageInput;
  audioInputType =  StoryBlockTypes.AudioInput;
  videoInputType = StoryBlockTypes.VideoInput;
  webhookType =  StoryBlockTypes.WebhookBlock;
  endStoryAnchor = StoryBlockTypes.EndStoryAnchorBlock;
  openQuestiontype = StoryBlockTypes.OpenEndedQuestion;


  blockFormGroup: FormGroup;

  iconClass = ''
  blockTitle = ''

  @ViewChild(CdkPortal) portal: CdkPortal;
  ref: ComponentRef<BlockComponent>;
  
  constructor(private _el: ElementRef,
              private _cd:ChangeDetectorRef,
              private _fb: FormBuilder,
              private _blockPortalBridge: BlockPortalService,
              private _blockInjectorService: BlockInjectorService,
              private _logger: Logger
  ) { }

  ngOnInit(): void {
    this.type = this.block.type;

    this.iconClass = this.getBlockIconAndTitle(this.type).icon;
    this.blockTitle = this.getBlockIconAndTitle(this.type).title;

    if (this.blocksGroup) {
      switch (this.type) {
        case StoryBlockTypes.TextMessage:
          this.blockFormGroup = _CreateTextMessageBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.Image:
          this.blockFormGroup = _CreateImageMessageBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.Name:
          this.blockFormGroup = _CreateNameMessageBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.Email:
          this.blockFormGroup = _CreateEmailMessageBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.PhoneNumber:
          this.blockFormGroup = _CreatePhoneMessageBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.QuestionBlock:
          this.blockFormGroup = _CreateQuestionBlockMessageForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.Location:
          this.blockFormGroup = _CreateLocationBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.List:
          this.blockFormGroup = _CreateListBlockMessageForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.Document:
          this.blockFormGroup = _CreateDocumentMessageBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.Audio:
          this.blockFormGroup = _CreateAudioBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break
        case StoryBlockTypes.Video:
          this.blockFormGroup = _CreateVideoMessageBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break
        case StoryBlockTypes.Sticker:
          this.blockFormGroup = _CreateStickerBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.Reply:
          this.blockFormGroup = _CreateReplyBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;

        case StoryBlockTypes.JumpBlock:
          this.blockFormGroup = _CreateJumpBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
  
        case StoryBlockTypes.MultipleInput:
        this.blockFormGroup = _CreateMultipleInputMessageBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;

        case StoryBlockTypes.FailBlock:
          this.blockFormGroup = _CreateFailBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break; 

        case StoryBlockTypes.ImageInput:
          this.blockFormGroup = _CreateImageInputBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;  
        case StoryBlockTypes.LocationInputBlock:
          this.blockFormGroup = _CreateLocationInputBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;  
        case StoryBlockTypes.AudioInput:
          this.blockFormGroup = _CreateAudioInputBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;  
        case StoryBlockTypes.WebhookBlock:
          this.blockFormGroup = _CreateWebhookBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;
        case StoryBlockTypes.EndStoryAnchorBlock:
          this.blockFormGroup = _CreateEndStoryAnchorBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;  
        case StoryBlockTypes.OpenEndedQuestion:
          this.blockFormGroup = _CreateOpenEndedQuestionBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;  
        case StoryBlockTypes.VideoInput:
          this.blockFormGroup = _CreateVideoInputBlockForm(this._fb, this.block);
          this.blocksGroup.push(this.blockFormGroup);
          break;  
        default:
          break;
      }
    }

  }

  getBlockIconAndTitle(type: number) {
    return iconsAndTitles[type];
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
    
    this.blockFormGroup.value.position = this.block.position;
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

  editBlock() {
    this._blockPortalBridge.sendFormGroup(this.blockFormGroup);
  }

  copyblock(block: StoryBlock) {
    block.id = (this.blocksGroup.value.length + 1).toString();
    block.position.x = block.position.x + 300;
    delete block.createdBy;
    delete block.createdOn;
    delete block.updatedOn;
    
    this._blockInjectorService.newBlock(block, this.jsPlumb, this.viewPort, this.blocksGroup);
  }

  deleteBlock() {
    this.block.deleted = true;
    this.blockFormGroup.value.deleted = true;
    const index = this.viewPort.indexOf(this.ref.hostView);
    this.viewPort.remove(index);
    this._cd.detectChanges();
  }
}

