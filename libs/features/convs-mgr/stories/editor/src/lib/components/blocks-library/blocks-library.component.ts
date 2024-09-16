import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';

import { SubSink } from 'subsink';
import { Observable, BehaviorSubject, map, combineLatest, of } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import {
  ImageMessageBlock, LocationMessageBlock, NameMessageBlock, QuestionMessageBlock,
  TextMessageBlock, EmailMessageBlock, PhoneMessageBlock, DocumentMessageBlock, StickerMessageBlock,
  VoiceMessageBlock, VideoMessageBlock, ListMessageBlock, JumpBlock, FailBlock,
  ImageInputBlock, LocationInputBlock, AudioInputBlock, VideoInputBlock, WebhookBlock, OpenEndedQuestionBlock,
  KeywordMessageBlock, EndStoryAnchorBlock, EventBlock, AssessmentBrick, ConditionalBlock, CMI5Block,
  MicroAppBlock, AssessmentMicroAppBlock, 
} from '@app/model/convs-mgr/stories/blocks/messaging';
import { ICONS_AND_TITLES } from '@app/features/convs-mgr/stories/blocks/library/main';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';
import { DragDropService } from '../../providers/drag-drop.service';
import { SideScreenToggleService } from '../../providers/side-screen-toggle.service';

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
  @Input() isInteractiveVoiceResponseModule: boolean;

  filterInput$$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isSideScreenOpen:boolean;

  blockTemplates: StoryBlock[] = [
    { id: 'input-message-block', type: StoryBlockTypes.TextMessage, message: 'Message', blockIcon: this.getBlockIcon(StoryBlockTypes.TextMessage), blockCategory: 'messages-block' } as TextMessageBlock,
    // { id: 'io-questions-block', type: StoryBlockTypes.Input, message: 'Input', blockIcon: this.getBlockIcon(StoryBlockTypes.Input) } as QuestionMessageBlock,
    { id: 'story-end-anchor', type:StoryBlockTypes.EndStoryAnchorBlock, message: 'End Story', blockIcon:this.getBlockIcon(StoryBlockTypes.EndStoryAnchorBlock), blockCategory: 'end-block'} as EndStoryAnchorBlock,
    // { id: 'io-block', type: StoryBlockTypes.IO, message: 'IO', blockIcon: this.getBlockIcon(StoryBlockTypes.IO) } as QuestionMessageBlock,
    { id: 'input-location-block', type: StoryBlockTypes.Location, message: 'Location', blockIcon: this.getBlockIcon(StoryBlockTypes.Location), blockCategory: 'messages-block' } as LocationMessageBlock,
    { id: 'input-image-block', type: StoryBlockTypes.Image, message: 'Image', blockIcon: this.getBlockIcon(StoryBlockTypes.Image), blockCategory: 'messages-block' } as ImageMessageBlock,
    { id: 'input-question-block', type: StoryBlockTypes.QuestionBlock, message: 'Buttons', blockIcon: this.getBlockIcon(StoryBlockTypes.QuestionBlock), blockCategory: 'questions-block' } as QuestionMessageBlock,
    { id: 'input-docs-block', type: StoryBlockTypes.Document, message: 'Document', blockIcon: this.getBlockIcon(StoryBlockTypes.Document), blockCategory: 'messages-block' } as DocumentMessageBlock,
    { id: 'input-audio-block', type: StoryBlockTypes.Audio, message: 'Audio', blockIcon: this.getBlockIcon(StoryBlockTypes.Audio), blockCategory: 'messages-block' } as VoiceMessageBlock,
    // { id: 'io-structural-block', type: StoryBlockTypes.Structural, message: 'Structural', blockIcon: this.getBlockIcon(StoryBlockTypes.Structural) } as TextMessageBlock,
    { id: 'io-name-block', type: StoryBlockTypes.Name, message: 'Name', blockIcon: this.getBlockIcon(StoryBlockTypes.Name), blockCategory: 'questions-block' } as NameMessageBlock,
    { id: 'io-email-block', type: StoryBlockTypes.Email, message: 'Email', blockIcon: this.getBlockIcon(StoryBlockTypes.Email), blockCategory: 'questions-block' } as EmailMessageBlock,
    { id: 'io-phone-block', type: StoryBlockTypes.PhoneNumber, message: 'Phone', blockIcon: this.getBlockIcon(StoryBlockTypes.PhoneNumber), blockCategory: 'questions-block' } as PhoneMessageBlock,
    { id: 'input-video-block', type: StoryBlockTypes.Video, message: 'Video', blockIcon: this.getBlockIcon(StoryBlockTypes.Video), blockCategory: 'messages-block' } as VideoMessageBlock,
    // { id: 'input-sticker-block', type: StoryBlockTypes.Sticker, message: 'Sticker', blockIcon: this.getBlockIcon(StoryBlockTypes.Sticker), blockCategory: 'images-block' } as StickerMessageBlock,
    { id: 'io-list-block', type: StoryBlockTypes.List, message: 'List', blockIcon: this.getBlockIcon(StoryBlockTypes.List), blockCategory: 'questions-block' } as ListMessageBlock,
    // { id: 'input-reply-block', type: StoryBlockTypes.Reply, message: 'Reply', blockIcon: this.getBlockIcon(StoryBlockTypes.Reply) } as ReplyMessageBlock,
    { id: 'jump-story-block', type: StoryBlockTypes.JumpBlock, message: 'Jump', blockIcon: this.getBlockIcon(StoryBlockTypes.JumpBlock), blockCategory: 'operation-block' } as JumpBlock,
    // { id: 'io-multiple-input-block', type: StoryBlockTypes.MultipleInput, message: 'MultipleInput', blockIcon:this.getBlockIcon(StoryBlockTypes.MultipleInput) } as MultipleInputMessageBlock,
    // { id: 'fail-block', type: StoryBlockTypes.FailBlock, message: 'Fail', blockIcon:this.getBlockIcon(StoryBlockTypes.FailBlock), blockCategory: 'questions-block' } as FailBlock,
    { id: 'io-image-input-block' , type: StoryBlockTypes.ImageInput, message: 'Image Input', blockIcon:this.getBlockIcon(StoryBlockTypes.ImageInput), blockCategory: 'questions-block' } as ImageInputBlock,
    { id: 'io-audio-input-block' , type: StoryBlockTypes.AudioInput, message: 'Audio Input', blockIcon:this.getBlockIcon(StoryBlockTypes.AudioInput), blockCategory: 'questions-block' } as AudioInputBlock,
    // { id: 'input-reply-block', type: StoryBlockTypes.Reply, message: 'Reply', blockIcon: this.getBlockIcon(StoryBlockTypes.Reply) } as ReplyMessageBlock
    { id: 'io-location-input-block' , type: StoryBlockTypes.LocationInputBlock, message: 'Location input', blockIcon:this.getBlockIcon(StoryBlockTypes.LocationInputBlock), blockCategory: 'questions-block' } as LocationInputBlock,
    { id: 'io-video-input-block', type: StoryBlockTypes.VideoInput, message: 'Video Input', blockIcon:this.getBlockIcon(StoryBlockTypes.VideoInput), blockCategory: 'questions-block' } as VideoInputBlock,
    { id: 'webhook-block' , type: StoryBlockTypes.WebhookBlock, message: 'Webhook', blockIcon:this.getBlockIcon(StoryBlockTypes.WebhookBlock), blockCategory: 'operation-block' } as WebhookBlock,
    { id: 'open-ended-question-block', type:StoryBlockTypes.OpenEndedQuestion, message: 'Open Ended Question', blockIcon:this.getBlockIcon(StoryBlockTypes.OpenEndedQuestion), blockCategory: 'questions-block' } as OpenEndedQuestionBlock,
    { id: 'keyword-jump-block', type:StoryBlockTypes.keyword, message: 'Keyword Jump', blockIcon:this.getBlockIcon(StoryBlockTypes.keyword), blockCategory: 'operation-block' } as KeywordMessageBlock,
    { id: 'event-block', type:StoryBlockTypes.Event, message: 'Event', blockIcon:this.getBlockIcon(StoryBlockTypes.Event), blockCategory: 'operation-block' } as EventBlock,
    // { id: 'assessment-brick', type:StoryBlockTypes.Assessment, message: 'Assessment', blockIcon:this.getBlockIcon(StoryBlockTypes.Assessment),  blockCategory: 'bricks' } as AssessmentBrick,
    { id: 'conditional-block', type:StoryBlockTypes.Conditional, message: 'Conditional', blockIcon:this.getBlockIcon(StoryBlockTypes.Conditional), blockCategory: 'operation-block' } as ConditionalBlock,
    // { id: 'end-anchor-block', type:StoryBlockTypes.EndStoryAnchorBlock, message: 'End Story', blockIcon:this.getBlockIcon(StoryBlockTypes.EndStoryAnchorBlock), blockCategory: 'end-block'} as EndStoryAnchorBlock
    // { id: 'CMI5-block', type:StoryBlockTypes.CMI5Block, message: 'CMI5 Block', blockIcon:this.getBlockIcon(StoryBlockTypes.CMI5Block), blockCategory: 'bricks' } as CMI5Block,
    { id: 'micro-app', type: StoryBlockTypes.MicroAppBlock, message: 'General', blockIcon: this. getBlockIcon(StoryBlockTypes.MicroAppBlock), blockCategory: 'Micro-apps'} as MicroAppBlock,
    { id: 'assessment-micro-app', type: StoryBlockTypes.AssessmentMicroAppBlock, message: 'Assessments', blockIcon: this. getBlockIcon(StoryBlockTypes.AssessmentMicroAppBlock), blockCategory: 'Micro-apps'} as AssessmentMicroAppBlock,
  ];
  blockTemplate$: Observable<StoryBlock[]> = of(this.blockTemplates);

  constructor(private _logger: Logger, private dragService: DragDropService, private sideScreen: SideScreenToggleService,) {}

  ngOnInit(): void {
    this._sbS.sink 
    = this.sideScreen.sideScreen$
        .subscribe((isOpen) => this.isSideScreenOpen = isOpen);

    // WARN in case frame is not yet loaded. This might cause issues on the node loader.
    if (!this.frame || !this.frame.loaded)
      this._logger.warn(() => `Blocks library loaded yet frame not yet loaded.`);
    this.filterBlockTemplates();
  }

  getBlockIcon(type: number) {
    return ICONS_AND_TITLES[type].icon;
  }

  getBlockSvg(type: number){
    return ICONS_AND_TITLES[type].svgIcon;
  }


  //A function that subscribes to when the search control changes and filters the blocks components list
  filterBlockTemplates() {
    this.blockTemplate$ = combineLatest([this.filterInput$$, this.blockTemplate$])
      .pipe(map(([filter, blocksArray]) => {
        return blocksArray.filter((block: StoryBlock) => {
          return block.message?.toString().toLowerCase().includes(filter);
        });
      }));
  }

  filterBlocks(event: any) {
    this.filterInput$$.next(event.target.value);
  }

  toggleSidenav() {
    this.sideScreen.toggleSideScreen(!this.isSideScreenOpen)
    // this.onClose()
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}
