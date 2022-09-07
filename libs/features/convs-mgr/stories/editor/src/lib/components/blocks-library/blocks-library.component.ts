import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';

import { SubSink } from 'subsink';
import { startWith } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageMessageBlock, LocationMessageBlock, NameMessageBlock, QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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

  @Input() frame: StoryEditorFrame;

  private _sbs = new SubSink();
  
  searchControl: FormControl = new FormControl('');


  blockTemplates: StoryBlock[] = [
    { id: 'io-block', type: StoryBlockTypes.TextMessage, message: 'Text Block' } as TextMessageBlock,
    { id: 'io-questions-block', type: StoryBlockTypes.IO, message: 'Question Block' } as QuestionMessageBlock,
    { id: 'input-location-block', type: StoryBlockTypes.Input, message: 'Location Block' } as LocationMessageBlock,
    { id: 'input-image-block', type: StoryBlockTypes.Image, message: 'Image Block' } as ImageMessageBlock,
    { id: 'io-name-block', type: StoryBlockTypes.Name, message:'Name Block' } as NameMessageBlock
  ];

  filteredBlockTemplates: StoryBlock[];

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
      case StoryBlockTypes.IO:
        this.frame.newBlock(StoryBlockTypes.IO);
        break;
      case StoryBlockTypes.Input:
        this.frame.newBlock(StoryBlockTypes.Input);
        break;
      case StoryBlockTypes.Image:
        this.frame.newBlock(StoryBlockTypes.Image);
        break;
      case StoryBlockTypes.Name:
        this.frame.newBlock(StoryBlockTypes.Name);
        break;
    }
  }

  //A function that subscribes to when the search control changes and filters the blocks components list 
  filterBlockTemplates() {
    this.searchControl.valueChanges.pipe(startWith('')).subscribe((value: string) => {
      this.filteredBlockTemplates = value != ""
        //this filters the block Templates if the value entered is not empty.
        ? this.blockTemplates.filter((blocks) => { return blocks.message?.toLowerCase().includes(value.toLowerCase()) })
        : this.blockTemplates
    })
  }

  ngOnDestroy() {
    this._sbs.unsubscribe();
  }

}
