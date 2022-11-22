import { Component, Input, OnInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';

import { SubSink } from 'subsink';
import { Observable, BehaviorSubject, map, combineLatest, of } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageMessageBlock, LocationMessageBlock, NameMessageBlock, QuestionMessageBlock,
          TextMessageBlock, EmailMessageBlock, PhoneMessageBlock, DocumentMessageBlock, StickerMessageBlock, 
          VoiceMessageBlock, VideoMessageBlock, ListMessageBlock, ReplyMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';

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
    { id: 'io-block', type: StoryBlockTypes.TextMessage, message: 'Text Block' } as TextMessageBlock,
    { id: 'io-questions-block', type: StoryBlockTypes.QuestionBlock, message: 'Question Block' } as QuestionMessageBlock,
    { id: 'input-location-block', type: StoryBlockTypes.Location, message: 'Location Block' } as LocationMessageBlock,
    { id: 'input-image-block', type: StoryBlockTypes.Image, message: 'Image Block' } as ImageMessageBlock,
    { id: 'io-name-block', type: StoryBlockTypes.Name, message: 'Name Block' } as NameMessageBlock,
    { id: 'io-email-block', type: StoryBlockTypes.Email, message: 'Email Block' } as EmailMessageBlock,
    { id: 'io-phone-block', type: StoryBlockTypes.PhoneNumber, message: 'Phone Block' } as PhoneMessageBlock,
    { id: 'input-audio-block', type:StoryBlockTypes.Audio, message:'Audio Block' } as VoiceMessageBlock,
    { id: 'input-video-block', type: StoryBlockTypes.Video, message: 'Video Block' } as VideoMessageBlock,
    { id: 'input-sticker-block', type: StoryBlockTypes.Sticker, message: 'Sticker Block' } as StickerMessageBlock,
    { id: 'io-list-block', type: StoryBlockTypes.List, message: 'List Block' } as ListMessageBlock,
    { id: 'input-docs-block', type:StoryBlockTypes.Document, message: 'Document Block' } as DocumentMessageBlock,
    { id:'input-reply-block', type:StoryBlockTypes.Reply, message:'Reply Block' } as ReplyMessageBlock
  ];
  blockTemplate$: Observable<StoryBlock[]> = of(this.blockTemplates);

  constructor(private _logger: Logger) { }

  ngOnInit(): void {
    // WARN in case frame is not yet loaded. This might cause issues on the node loader.
    if (!this.frame || !this.frame.loaded)
      this._logger.warn(() => `Blocks library loaded yet frame not yet loaded.`);
    this.filterBlockTemplates();
  }

  addBlock(type: StoryBlockTypes) {
    switch (type) {
      case StoryBlockTypes.TextMessage:
        this.frame.newBlock(StoryBlockTypes.TextMessage);
        break;
      case StoryBlockTypes.Image:
        this.frame.newBlock(StoryBlockTypes.Image);
        break;
      case StoryBlockTypes.Name:
        this.frame.newBlock(StoryBlockTypes.Name);
        break;
      case StoryBlockTypes.Email:
        this.frame.newBlock(StoryBlockTypes.Email);
        break;
      case StoryBlockTypes.PhoneNumber:
        this.frame.newBlock(StoryBlockTypes.PhoneNumber);
        break;
      case StoryBlockTypes.QuestionBlock:
        this.frame.newBlock(StoryBlockTypes.QuestionBlock);
        break;
      case StoryBlockTypes.Location:
        this.frame.newBlock(StoryBlockTypes.Location);
        break;
     case StoryBlockTypes.Audio:
          this.frame.newBlock(StoryBlockTypes.Audio);
          break;
      case StoryBlockTypes.Video:
        this.frame.newBlock(StoryBlockTypes.Video);
        break
      case StoryBlockTypes.Sticker:
        this.frame.newBlock(StoryBlockTypes.Sticker);
        break
      case StoryBlockTypes.List:
        this.frame.newBlock(StoryBlockTypes.List);
        break;
      case StoryBlockTypes.Document:
        this.frame.newBlock(StoryBlockTypes.Document);
        break
      case StoryBlockTypes.Reply:
        this.frame.newBlock(StoryBlockTypes.Reply);
        break;
    }
  }

  //A function that subscribes to when the search control changes and filters the blocks components list 
  filterBlockTemplates() {
    this.blockTemplate$ = combineLatest([this.filterInput$$, this.blockTemplate$])
      .pipe(map(([filter, blocksArray]) => blocksArray
        .filter((block: StoryBlock) => {
          return block.message!.toString().toLowerCase().includes(filter)
        })))
  }

  filterBlocks(event: any) {
    this.filterInput$$.next(event.target.value);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }

}
