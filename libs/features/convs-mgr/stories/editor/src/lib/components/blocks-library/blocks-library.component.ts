import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';

import { SubSink } from 'subsink';
import { Observable, BehaviorSubject, map, combineLatest, of } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import {
  ImageMessageBlock, LocationMessageBlock, NameMessageBlock, QuestionMessageBlock,
  TextMessageBlock, EmailMessageBlock, PhoneMessageBlock, DocumentMessageBlock, StickerMessageBlock,
  VoiceMessageBlock, VideoMessageBlock, ListMessageBlock, JumpBlock, MultipleInputMessageBlock, FailBlock,
  ImageInputBlock, LocationInputBlock, AudioInputBlock, VideoInputBlock, WebhookBlock, OpenEndedQuestionBlock,
  KeywordMessageBlock, MultiContentInputBlock, EndStoryAnchorBlock, EventBlock, AssessmentBrick
} from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';
import { DragDropService } from '../../providers/drag-drop.service';
import { iconsAndTitles } from 'libs/features/convs-mgr/stories/blocks/library/main/src/lib/model/icons-and-titles';
import { Coordinate } from '../../model/coordinates.interface';

/**
 * Component which holds a library (list) of all blocks that can be created
 *    in the story editor.
 */
@Component({
  selector: 'convl-blocks-library',
  templateUrl: './blocks-library.component.html',
  styleUrls: ['./blocks-library.component.scss']
})
export class BlocksLibraryComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  @Input() frame: StoryEditorFrame;
  filterInput$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  blockTemplates: StoryBlock[] = [
    { id: 'input-message-block', type: StoryBlockTypes.TextMessage, message: 'Message', blockIcon: this.getBlockIcon(StoryBlockTypes.TextMessage), blockCategory: 'messages-block' } as TextMessageBlock,
    // { id: 'io-questions-block', type: StoryBlockTypes.Input, message: 'Input', blockIcon: this.getBlockIcon(StoryBlockTypes.Input) } as QuestionMessageBlock,
    { id: 'story-end-anchor', type:StoryBlockTypes.EndStoryAnchorBlock, message: 'End Story', blockIcon:this.getBlockIcon(StoryBlockTypes.EndStoryAnchorBlock), blockCategory: 'end-block'} as EndStoryAnchorBlock,
    // { id: 'io-block', type: StoryBlockTypes.IO, message: 'IO', blockIcon: this.getBlockIcon(StoryBlockTypes.IO) } as QuestionMessageBlock,
    { id: 'input-location-block', type: StoryBlockTypes.Location, message: 'Location', blockIcon: this.getBlockIcon(StoryBlockTypes.Location), blockCategory: 'questions-block' } as LocationMessageBlock,
    { id: 'input-image-block', type: StoryBlockTypes.Image, message: 'Image', blockIcon: this.getBlockIcon(StoryBlockTypes.Image), blockCategory: 'images-block' } as ImageMessageBlock,
    { id: 'input-question-block', type: StoryBlockTypes.QuestionBlock, message: 'Question', blockIcon: this.getBlockIcon(StoryBlockTypes.QuestionBlock), blockCategory: 'questions-block' } as QuestionMessageBlock,
    { id: 'input-docs-block', type: StoryBlockTypes.Document, message: 'Document', blockIcon: this.getBlockIcon(StoryBlockTypes.Document), blockCategory: 'documents-block' } as DocumentMessageBlock,
    { id: 'input-audio-block', type: StoryBlockTypes.Audio, message: 'Audio', blockIcon: this.getBlockIcon(StoryBlockTypes.Audio), blockCategory: 'multimedia-block' } as VoiceMessageBlock,
    // { id: 'io-structural-block', type: StoryBlockTypes.Structural, message: 'Structural', blockIcon: this.getBlockIcon(StoryBlockTypes.Structural) } as TextMessageBlock,
    { id: 'io-name-block', type: StoryBlockTypes.Name, message: 'Name', blockIcon: this.getBlockIcon(StoryBlockTypes.Name), blockCategory: 'questions-block' } as NameMessageBlock,
    { id: 'io-email-block', type: StoryBlockTypes.Email, message: 'Email', blockIcon: this.getBlockIcon(StoryBlockTypes.Email), blockCategory: 'questions-block' } as EmailMessageBlock,
    { id: 'io-phone-block', type: StoryBlockTypes.PhoneNumber, message: 'Phone', blockIcon: this.getBlockIcon(StoryBlockTypes.PhoneNumber), blockCategory: 'questions-block' } as PhoneMessageBlock,
    { id: 'input-video-block', type: StoryBlockTypes.Video, message: 'Video', blockIcon: this.getBlockIcon(StoryBlockTypes.Video), blockCategory: 'multimedia-block' } as VideoMessageBlock,
    { id: 'input-sticker-block', type: StoryBlockTypes.Sticker, message: 'Sticker', blockIcon: this.getBlockIcon(StoryBlockTypes.Sticker), blockCategory: 'images-block' } as StickerMessageBlock,
    { id: 'io-list-block', type: StoryBlockTypes.List, message: 'List', blockIcon: this.getBlockIcon(StoryBlockTypes.List), blockCategory: 'questions-block' } as ListMessageBlock,
    // { id: 'input-reply-block', type: StoryBlockTypes.Reply, message: 'Reply', blockIcon: this.getBlockIcon(StoryBlockTypes.Reply) } as ReplyMessageBlock,
    { id: 'jump-story-block', type: StoryBlockTypes.JumpBlock, message: 'Jump', blockIcon: this.getBlockIcon(StoryBlockTypes.JumpBlock), blockCategory: 'questions-block' } as JumpBlock,
    // { id: 'io-multiple-input-block', type: StoryBlockTypes.MultipleInput, message: 'MultipleInput', blockIcon:this.getBlockIcon(StoryBlockTypes.MultipleInput) } as MultipleInputMessageBlock,
    { id: 'fail-block', type: StoryBlockTypes.FailBlock, message: 'Fail', blockIcon:this.getBlockIcon(StoryBlockTypes.FailBlock), blockCategory: 'questions-block' } as FailBlock,
    { id: 'io-image-input-block' , type: StoryBlockTypes.ImageInput, message: 'Image Input', blockIcon:this.getBlockIcon(StoryBlockTypes.ImageInput), blockCategory: 'images-block' } as ImageInputBlock,
    { id: 'io-audio-input-block' , type: StoryBlockTypes.AudioInput, message: 'Audio Input', blockIcon:this.getBlockIcon(StoryBlockTypes.AudioInput), blockCategory: 'multimedia-block' } as AudioInputBlock,
    // { id: 'input-reply-block', type: StoryBlockTypes.Reply, message: 'Reply', blockIcon: this.getBlockIcon(StoryBlockTypes.Reply) } as ReplyMessageBlock
    { id: 'io-location-input-block' , type: StoryBlockTypes.LocationInputBlock, message: 'Location Input', blockIcon:this.getBlockIcon(StoryBlockTypes.LocationInputBlock), blockCategory: 'questions-block' } as LocationInputBlock,
    { id: 'io-video-input-block', type: StoryBlockTypes.VideoInput, message: 'Video Input', blockIcon:this.getBlockIcon(StoryBlockTypes.VideoInput), blockCategory: 'multimedia-block' } as VideoInputBlock,
    { id: 'webhook-block' , type: StoryBlockTypes.WebhookBlock, message: 'Webhook', blockIcon:this.getBlockIcon(StoryBlockTypes.WebhookBlock), blockCategory: 'questions-block' } as WebhookBlock,
    { id: 'open-ended-question-block', type:StoryBlockTypes.OpenEndedQuestion, message: 'Open Ended Question', blockIcon:this.getBlockIcon(StoryBlockTypes.OpenEndedQuestion), blockCategory: 'questions-block' } as OpenEndedQuestionBlock,
    { id: 'multi-content-input' , type:StoryBlockTypes.MultiContentInput, message:'Multi Content Input', blockIcon:this.getBlockIcon(StoryBlockTypes.MultiContentInput), blockCategory: 'multimedia-block' } as MultiContentInputBlock,
    { id: 'keyword-jump-block', type:StoryBlockTypes.keyword, message: 'Keyword Jump', blockIcon:this.getBlockIcon(StoryBlockTypes.keyword), blockCategory: 'questions-block' } as KeywordMessageBlock,
    { id: 'event-block', type:StoryBlockTypes.Event, message: 'Event', blockIcon:this.getBlockIcon(StoryBlockTypes.Event), blockCategory: 'questions-block' } as EventBlock,
    { id: 'assessment-brick', type:StoryBlockTypes.Assessment, message: 'Assessment', blockIcon:this.getBlockIcon(StoryBlockTypes.Assessment), blockCategory: 'bricks' } as AssessmentBrick,
    // { id: 'end-anchor-block', type:StoryBlockTypes.EndStoryAnchorBlock, message: 'End Story', blockIcon:this.getBlockIcon(StoryBlockTypes.EndStoryAnchorBlock), blockCategory: 'end-block'} as EndStoryAnchorBlock
  ];
  blockTemplate$: Observable<StoryBlock[]> = of(this.blockTemplates);
  coordinates: Coordinate;
  constructor(private _logger: Logger, private dragService: DragDropService) {}

  ngOnInit(): void {
    // WARN in case frame is not yet loaded. This might cause issues on the node loader.
    if (!this.frame || !this.frame.loaded)
      this._logger.warn(() => `Blocks library loaded yet frame not yet loaded.`);
    this.filterBlockTemplates();
    this._sbS.sink = this.dragService.coord$.subscribe(position => this.coordinates = position)
  }
  addBlock(type: number, coordinates?: Coordinate) {
    switch (type) {
      case StoryBlockTypes.EndStoryAnchorBlock:
        this.frame.newBlock(StoryBlockTypes.EndStoryAnchorBlock, coordinates);
        break;
      case StoryBlockTypes.TextMessage:
        this.frame.newBlock(StoryBlockTypes.TextMessage, coordinates);
        break;
      case StoryBlockTypes.Input:
        this.frame.newBlock(StoryBlockTypes.Input, coordinates);
        break;
      case StoryBlockTypes.IO:
        this.frame.newBlock(StoryBlockTypes.IO, coordinates);
        break;
      case StoryBlockTypes.Location:
        this.frame.newBlock(StoryBlockTypes.Location, coordinates);
        break;
      case StoryBlockTypes.Image:
        this.frame.newBlock(StoryBlockTypes.Image, coordinates);
        break;
      case StoryBlockTypes.QuestionBlock:
        this.frame.newBlock(StoryBlockTypes.QuestionBlock, coordinates);
        break;
      case StoryBlockTypes.Document:
        this.frame.newBlock(StoryBlockTypes.Document, coordinates);
        break;
      case StoryBlockTypes.Audio:
        this.frame.newBlock(StoryBlockTypes.Audio, coordinates);
        break;
      case StoryBlockTypes.Structural:
        this.frame.newBlock(StoryBlockTypes.Structural, coordinates);
        break
      case StoryBlockTypes.Name:
        this.frame.newBlock(StoryBlockTypes.Name, coordinates);
        break
      case StoryBlockTypes.Email:
        this.frame.newBlock(StoryBlockTypes.Email, coordinates);
        break;
      case StoryBlockTypes.PhoneNumber:
        this.frame.newBlock(StoryBlockTypes.PhoneNumber, coordinates);
        break
      case StoryBlockTypes.Video:
        this.frame.newBlock(StoryBlockTypes.Video, coordinates);
        break;
      case StoryBlockTypes.Sticker:
        this.frame.newBlock(StoryBlockTypes.Sticker, coordinates);
        break;
      case StoryBlockTypes.List:
        this.frame.newBlock(StoryBlockTypes.List, coordinates);
        break;
      case StoryBlockTypes.Reply:
        this.frame.newBlock(StoryBlockTypes.Reply, coordinates);
        break;
      case StoryBlockTypes.JumpBlock:
        this.frame.newBlock(StoryBlockTypes.JumpBlock, coordinates);
        break;
      case StoryBlockTypes.MultipleInput:
        this.frame.newBlock(StoryBlockTypes.MultipleInput, coordinates);
        break;
      case StoryBlockTypes.FailBlock:
        this.frame.newBlock(StoryBlockTypes.FailBlock, coordinates);
        break;
      case StoryBlockTypes.ImageInput:
        this.frame.newBlock(StoryBlockTypes.ImageInput, coordinates);
        break;
      case StoryBlockTypes.LocationInputBlock:
        this.frame.newBlock(StoryBlockTypes.LocationInputBlock, coordinates);
        break;
      case StoryBlockTypes.AudioInput:
        this.frame.newBlock(StoryBlockTypes.AudioInput, coordinates);
        break;
      case StoryBlockTypes.VideoInput:
        this.frame.newBlock(StoryBlockTypes.VideoInput, coordinates);
        break;
      case StoryBlockTypes.WebhookBlock:
        this.frame.newBlock(StoryBlockTypes.WebhookBlock, coordinates);
        break;
      case StoryBlockTypes.OpenEndedQuestion:
        this.frame.newBlock(StoryBlockTypes.OpenEndedQuestion, coordinates);
        break;
      case StoryBlockTypes.MultiContentInput:
        this.frame.newBlock(StoryBlockTypes.MultiContentInput, coordinates);
        break;
      case StoryBlockTypes.keyword:
        this.frame.newBlock(StoryBlockTypes.keyword, coordinates);
        break;
      case StoryBlockTypes.Event:
        this.frame.newBlock(StoryBlockTypes.Event, coordinates);
        break;
      case StoryBlockTypes.Assessment:
        this.frame.newBlock(StoryBlockTypes.Assessment, coordinates);
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

  onDragEnd(blockType: number){
    this.addBlock(blockType, this.coordinates)
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }

}
