import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { BlockComponent } from '../components/block/block.component';

import { QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _MessageBlockDecoratePlumb } from '../components/message-block/message-block.jsplumb';
import { _QuestionsBlockDecoratePlumb } from '../components/questions-block/questions-block.jsplumb';

/**
 * This function adds jsPlumb endpoints to rendered components. 
 *  The rendering location will depend on the type and configuration of the block.
 * 
 * @param block   - Block data structure. Used by some components to determine location and configuration of the endpoints, anchors, etc.
 * @param comp    - Angular component rendered in the viewport 
 * @param jsPlumb - Active jsPlumb instance
 */
export function _JsPlumbComponentDecorator(block: StoryBlock, comp: ComponentRef<BlockComponent>, jsPlumb: BrowserJsPlumbInstance)
{
  /** Lift component into jsPlumb world. */
  jsPlumb.manage(comp.location.nativeElement, block.id);

  switch(block.type)
  {
    case StoryBlockTypes.TextMessage:
      return _MessageBlockDecoratePlumb(block as TextMessageBlock, comp, jsPlumb);

    case StoryBlockTypes.IO:
      return _QuestionsBlockDecoratePlumb(block as QuestionMessageBlock, comp, jsPlumb);
  }

  // Default case
  return comp;
}
