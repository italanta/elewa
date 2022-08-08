import { Component, Input, OnInit } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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
  @Input() frame: StoryEditorFrame;

  blockTemplates: TextMessageBlock[] = [
    { id: 'io-block', type: StoryBlockTypes.TextMessage, message: 'Text Block' } as TextMessageBlock,
    { id: 'io-block', type: StoryBlockTypes.IO, message: 'Question Block' } as QuestionMessageBlock
  ];

  constructor(private _logger: Logger) 
  { }

  ngOnInit(): void {
    // WARN in case frame is not yet loaded. This might cause issues on the node loader.
    if(!this.frame || !this.frame.loaded)
      this._logger.warn(() => `Blocks library loaded yet frame not yet loaded.`);
  }

  addBlock(type: StoryBlockTypes)
  {
    switch(type) {
      case StoryBlockTypes.TextMessage:
        this.frame.newBlock(StoryBlockTypes.TextMessage);
        break

      case StoryBlockTypes.IO:
        this.frame.newBlock(StoryBlockTypes.IO);
    }
  }
  
}
