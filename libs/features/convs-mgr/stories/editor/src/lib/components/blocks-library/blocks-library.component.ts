import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { ButtonsBlock, } from '@app/model/convs-mgr/stories/blocks/scenario';
import { Component, Input, OnInit } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock, QuestionButtonsBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


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
export class BlocksLibraryComponent<T> implements OnInit
{
  @Input() frame: StoryEditorFrame<T>;

  blockTemplates: TextMessageBlock[] = [{ id: 'io-block', type: StoryBlockTypes.TextMessage, message: 'Text Block' } as TextMessageBlock, ];
  blockQuestions: QuestionButtonsBlock<T>[] = [{ id: 'io-block', type: StoryBlockTypes.IO, message: 'Question Block',buttons:[{id:'io-block', message: 'buttons block', value: {}} as ButtonsBlockButton<T>]} as QuestionButtonsBlock<T>];

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
        break;
      case StoryBlockTypes.IO:
        this.frame.newBlock(StoryBlockTypes.IO);
        break;
    }
  }
  
}
