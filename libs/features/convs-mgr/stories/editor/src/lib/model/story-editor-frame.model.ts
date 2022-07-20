import { ViewContainerRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/main';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 * Model which holds the state of a story-editor.
 * 
 * For each JsPlumb frame, an instance of this class is created which 1-on-1 manages the frame state.
 */
export class StoryEditorFrame 
{
  private _cnt = 1;
  loaded = false;

  constructor(private _jsPlumb: BrowserJsPlumbInstance,
              private _blocksInjector: BlockInjectorService,
              private _viewport: ViewContainerRef)
  {
    this.loaded = true;
  }

  // draw()
  // {
    
  // }

  newBlock(type: StoryBlockTypes)
  {
    const block = { id: `${this._cnt}`, type: StoryBlockTypes.Output, message: 'New message' } as TextMessageBlock;
    this._cnt++;

    return this._blocksInjector.newBlock(block, this._jsPlumb, this._viewport);
  }
}