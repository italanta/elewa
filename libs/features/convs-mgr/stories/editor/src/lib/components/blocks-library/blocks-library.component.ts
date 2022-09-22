import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


import { Logger } from '@iote/bricks-angular';

import { SubSink } from 'subsink';
import { Observable, BehaviorSubject, map, combineLatest, of, filter } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { LocationMessageBlock, QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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
export class BlocksLibraryComponent implements OnInit
 {
  private _sbS = new SubSink();

  @Input() frame: StoryEditorFrame;

  filterInput$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  blockTemplates: StoryBlock[] = [
    { id: 'io-block', type: StoryBlockTypes.TextMessage, message: 'Text Block' } as TextMessageBlock,
    { id: 'io-questions-block', type: StoryBlockTypes.QuestionBlock, message: 'Question Block' } as QuestionMessageBlock,
    { id: 'input-location-block', type: StoryBlockTypes.Location, message: 'Location Block' } as LocationMessageBlock
  ];
  blockTemplate$: Observable<StoryBlock[]> = of(this.blockTemplates);

  constructor(private _logger: Logger) {}

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
        break

      case StoryBlockTypes.QuestionBlock:
        this.frame.newBlock(StoryBlockTypes.QuestionBlock);
        break

      case StoryBlockTypes.Location:
        this.frame.newBlock(StoryBlockTypes.Location);
        break
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
