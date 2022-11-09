import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { BlockComponent } from '../components/block/block.component';

import { DocumentMessageBlock, EmailMessageBlock, ImageMessageBlock, LocationMessageBlock, NameMessageBlock, PhoneMessageBlock, QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _MessageBlockDecoratePlumb } from './message-block.jsplumb'; 
import { _QuestionsBlockDecoratePlumb } from './questions-block.jsplumb';
import { _LocationBlockDecoratePlumb } from './location-block.jsplumb';
import { _ImageBlockDecoratePlumb } from './image-block.jsplumb';
import { _NameBlockDecoratePlumb } from './name-block.jsplumb';
import { _EmailBlockDecoratePlumb } from './email-block.jsplumb';
import { _PhoneBlockDecoratePlumb } from './phonenumber-block.jsplumb';
import { _DocumentBlockDecoratePlumb } from './document-block.jsplumb';
import { _AnchorBlockDecoratePlumb } from './anchor-block.jsplumb';

/**
 * This function adds jsPlumb endpoints to rendered components. 
 *  The rendering location will depend on the type and configuration of the block.
 * 
 * @param block   - Block data structure. Used by some components to determine location and configuration of the endpoints, anchors, etc.
 * @param comp    - Angular component rendered in the viewport 
 * @param jsPlumb - Active jsPlumb instance
 */
export function _JsPlumbComponentDecorator(block: StoryBlock, comp: ComponentRef<BlockComponent>, jsPlumb: BrowserJsPlumbInstance) {
  /** Lift component into jsPlumb world. */
  jsPlumb.manage(comp.location.nativeElement, block.id);
  
  switch (block.type) {
    case StoryBlockTypes.TextMessage:
      return _MessageBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Image:
      return _ImageBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Name:
        return _NameBlockDecoratePlumb(block, comp, jsPlumb);
        break;
     case StoryBlockTypes.Email:
        return _EmailBlockDecoratePlumb(block, comp, jsPlumb);
        break;
      case StoryBlockTypes.PhoneNumber:
          return _PhoneBlockDecoratePlumb(block as PhoneMessageBlock, comp, jsPlumb);
          break;
    case StoryBlockTypes.QuestionBlock:
      return _QuestionsBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Location:
      return _LocationBlockDecoratePlumb(block, comp, jsPlumb);
      break;
    case StoryBlockTypes.Document:
        return _DocumentBlockDecoratePlumb(block as DocumentMessageBlock, comp, jsPlumb);
    case StoryBlockTypes.AnchorBlock:
        return _AnchorBlockDecoratePlumb(comp, jsPlumb);
        break;
  }

  // Default case
  return comp;
}


