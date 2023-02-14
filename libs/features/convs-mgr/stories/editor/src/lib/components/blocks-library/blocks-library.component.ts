import { Component, Input, OnInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';

import { SubSink } from 'subsink';
import { Observable, BehaviorSubject, map, combineLatest, of } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import {
  ImageMessageBlock, LocationMessageBlock, NameMessageBlock, QuestionMessageBlock,
  TextMessageBlock, EmailMessageBlock, PhoneMessageBlock, DocumentMessageBlock, StickerMessageBlock,
  VoiceMessageBlock, VideoMessageBlock, ListMessageBlock, JumpBlock, MultipleInputMessageBlock, FailBlock, ImageInputBlock, LocationInputBlock, AudioInputBlock, VideoInputBlock, WebhookBlock, OpenEndedQuestionBlock
} from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';

import { iconsAndTitles } from 'libs/features/convs-mgr/stories/blocks/library/main/src/lib/model/icons-and-titles';

/**
 * Component which holds a library (list) of all blocks that can be created 
 *    in the story editor.
 */
@Component({
  selector: 'convl-blocks-library',
  templateUrl: './blocks-library.component.html',
  styleUrls: ['./blocks-library.component.scss']
})
export class BlocksLibraryComponent implements OnInit {
  private _sbS = new SubSink();

  @Input() frame: StoryEditorFrame;
  filterInput$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  blockTemplates: StoryBlock[] = [
    { id: 'input-message-block', type: StoryBlockTypes.TextMessage, message: 'Message', blockIcon: this.getBlockIcon(StoryBlockTypes.TextMessage) } as TextMessageBlock,
    // { id: 'io-questions-block', type: StoryBlockTypes.Input, message: 'Input', blockIcon: this.getBlockIcon(StoryBlockTypes.Input) } as QuestionMessageBlock,
    // { id: 'io-block', type: StoryBlockTypes.IO, message: 'IO', blockIcon: this.getBlockIcon(StoryBlockTypes.IO) } as QuestionMessageBlock,
    { id: 'input-location-block', type: StoryBlockTypes.Location, message: 'Location', blockIcon: this.getBlockIcon(StoryBlockTypes.Location) } as LocationMessageBlock,
    { id: 'input-image-block', type: StoryBlockTypes.Image, message: 'Image', blockIcon: this.getBlockIcon(StoryBlockTypes.Image) } as ImageMessageBlock,
    { id: 'input-question-block', type: StoryBlockTypes.QuestionBlock, message: 'Question', blockIcon: this.getBlockIcon(StoryBlockTypes.QuestionBlock) } as QuestionMessageBlock,
    { id: 'input-docs-block', type: StoryBlockTypes.Document, message: 'Document', blockIcon: this.getBlockIcon(StoryBlockTypes.Document) } as DocumentMessageBlock,
    { id: 'input-audio-block', type: StoryBlockTypes.Audio, message: 'Audio', blockIcon: this.getBlockIcon(StoryBlockTypes.Audio) } as VoiceMessageBlock,
    // { id: 'io-structural-block', type: StoryBlockTypes.Structural, message: 'Structural', blockIcon: this.getBlockIcon(StoryBlockTypes.Structural) } as TextMessageBlock,
    { id: 'io-name-block', type: StoryBlockTypes.Name, message: 'Name', blockIcon: this.getBlockIcon(StoryBlockTypes.Name) } as NameMessageBlock,
    { id: 'io-email-block', type: StoryBlockTypes.Email, message: 'Email', blockIcon: this.getBlockIcon(StoryBlockTypes.Email) } as EmailMessageBlock,
    { id: 'io-phone-block', type: StoryBlockTypes.PhoneNumber, message: 'Phone', blockIcon: this.getBlockIcon(StoryBlockTypes.PhoneNumber) } as PhoneMessageBlock,
    { id: 'input-video-block', type: StoryBlockTypes.Video, message: 'Video', blockIcon: this.getBlockIcon(StoryBlockTypes.Video) } as VideoMessageBlock,
    { id: 'input-sticker-block', type: StoryBlockTypes.Sticker, message: 'Sticker', blockIcon: this.getBlockIcon(StoryBlockTypes.Sticker) } as StickerMessageBlock,
    { id: 'io-list-block', type: StoryBlockTypes.List, message: 'List', blockIcon: this.getBlockIcon(StoryBlockTypes.List) } as ListMessageBlock,
    // { id: 'input-reply-block', type: StoryBlockTypes.Reply, message: 'Reply', blockIcon: this.getBlockIcon(StoryBlockTypes.Reply) } as ReplyMessageBlock,
    { id: 'jump-story-block', type: StoryBlockTypes.JumpBlock, message: 'Jump', blockIcon: this.getBlockIcon(StoryBlockTypes.JumpBlock) } as JumpBlock,
    { id: 'io-multiple-input-block', type: StoryBlockTypes.MultipleInput, message: 'MultipleInput', blockIcon:this.getBlockIcon(StoryBlockTypes.MultipleInput) } as MultipleInputMessageBlock,
    { id: 'fail-block', type: StoryBlockTypes.FailBlock, message: 'Fail', blockIcon:this.getBlockIcon(StoryBlockTypes.FailBlock) } as FailBlock,
    { id: 'io-image-input-block' , type: StoryBlockTypes.ImageInput, message: 'ImageInput', blockIcon:this.getBlockIcon(StoryBlockTypes.ImageInput) } as ImageInputBlock,
    { id: 'io-audio-input-block' , type: StoryBlockTypes.AudioInput, message: 'Audio Input', blockIcon:this.getBlockIcon(StoryBlockTypes.AudioInput) } as AudioInputBlock,
    // { id: 'input-reply-block', type: StoryBlockTypes.Reply, message: 'Reply', blockIcon: this.getBlockIcon(StoryBlockTypes.Reply) } as ReplyMessageBlock
    { id: 'io-location-input-block' , type: StoryBlockTypes.LocationInputBlock, message: 'LocationInput', blockIcon:this.getBlockIcon(StoryBlockTypes.LocationInputBlock) } as LocationInputBlock,
    { id: 'io-video-input-block', type: StoryBlockTypes.VideoInput, message: 'VideoInput', blockIcon:this.getBlockIcon(StoryBlockTypes.VideoInput) } as VideoInputBlock,
    { id: 'webhook-block' , type: StoryBlockTypes.WebhookBlock, message: 'Webhook', blockIcon:this.getBlockIcon(StoryBlockTypes.WebhookBlock) } as WebhookBlock,
    { id: 'open-ended-question-block', type:StoryBlockTypes.OpenEndedQuestion, message: 'Open Ended Question', blockIcon:this.getBlockIcon(StoryBlockTypes.OpenEndedQuestion) } as OpenEndedQuestionBlock,
  ];
  blockTemplate$: Observable<StoryBlock[]> = of(this.blockTemplates);
  constructor(private _logger: Logger) { }

  ngOnInit(): void {
    // WARN in case frame is not yet loaded. This might cause issues on the node loader.
    if (!this.frame || !this.frame.loaded)
      this._logger.warn(() => `Blocks library loaded yet frame not yet loaded.`);
    this.filterBlockTemplates();
  }
  addBlock(type: number) {
    switch (type) {
      case StoryBlockTypes.TextMessage:
        this.frame.newBlock(StoryBlockTypes.TextMessage);
        break;
      case StoryBlockTypes.Input:
        this.frame.newBlock(StoryBlockTypes.Input);
        break;
      case StoryBlockTypes.IO:
        this.frame.newBlock(StoryBlockTypes.IO);
        break;
      case StoryBlockTypes.Location:
        this.frame.newBlock(StoryBlockTypes.Location);
        break;
      case StoryBlockTypes.Image:
        this.frame.newBlock(StoryBlockTypes.Image);
        break;
      case StoryBlockTypes.QuestionBlock:
        this.frame.newBlock(StoryBlockTypes.QuestionBlock);
        break;
      case StoryBlockTypes.Document:
        this.frame.newBlock(StoryBlockTypes.Document);
        break;
      case StoryBlockTypes.Audio:
        this.frame.newBlock(StoryBlockTypes.Audio);
        break;
      case StoryBlockTypes.Structural:
        this.frame.newBlock(StoryBlockTypes.Structural);
        break
      case StoryBlockTypes.Name:
        this.frame.newBlock(StoryBlockTypes.Name);
        break
      case StoryBlockTypes.Email:
        this.frame.newBlock(StoryBlockTypes.Email);
        break;
      case StoryBlockTypes.PhoneNumber:
        this.frame.newBlock(StoryBlockTypes.PhoneNumber);
        break
      case StoryBlockTypes.Video:
        this.frame.newBlock(StoryBlockTypes.Video);
        break;
      case StoryBlockTypes.Sticker:
        this.frame.newBlock(StoryBlockTypes.Sticker);
        break;
      case StoryBlockTypes.List:
        this.frame.newBlock(StoryBlockTypes.List);
        break;
      case StoryBlockTypes.Reply:
        this.frame.newBlock(StoryBlockTypes.Reply);
        break;
      case StoryBlockTypes.JumpBlock:
        this.frame.newBlock(StoryBlockTypes.JumpBlock);
        break;
      case StoryBlockTypes.MultipleInput:
        this.frame.newBlock(StoryBlockTypes.MultipleInput);
        break;
      case StoryBlockTypes.FailBlock:
        this.frame.newBlock(StoryBlockTypes.FailBlock);
        break;
      case StoryBlockTypes.ImageInput:
        this.frame.newBlock(StoryBlockTypes.ImageInput);
        break;
      case StoryBlockTypes.LocationInputBlock:
        this.frame.newBlock(StoryBlockTypes.LocationInputBlock);
        break;
      case StoryBlockTypes.AudioInput:
        this.frame.newBlock(StoryBlockTypes.AudioInput);
        break;
      case StoryBlockTypes.VideoInput:
        this.frame.newBlock(StoryBlockTypes.VideoInput);
        break;  
      case StoryBlockTypes.WebhookBlock:
        this.frame.newBlock(StoryBlockTypes.WebhookBlock);
        break;
      case StoryBlockTypes.OpenEndedQuestion:
        this.frame.newBlock(StoryBlockTypes.OpenEndedQuestion);
        break;  
    }
  }
  getBlockIcon(type: number) {
    return iconsAndTitles[type].icon;

  }
  //A function that subscribes to when the search control changes and filters the blocks components list 
  filterBlockTemplates() {
    this.blockTemplate$ = combineLatest([this.filterInput$$, this.blockTemplate$])
      .pipe(map(([filter, blocksArray]) => blocksArray
        .filter((block: StoryBlock) => {
          return block.message?.toString().toLowerCase().includes(filter)
        })))
  }

  filterBlocks(event: any) {
    this.filterInput$$.next(event.target.value);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }

}
