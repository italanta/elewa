import { QuestionButtonsBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';



import { ButtonsBlock } from '@app/model/convs-mgr/stories/blocks/scenario';

import { BlockComponent } from "../block/block.component";// 

/**
 * Decorates MessageBlock with JS plumb connectors.
 * 
 * @param block   - TextMessageBlock data structure.
 * @param comp    - Angular component within the viewport 
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _ButtonsBlockDecoratePlumb<T>(block: QuestionButtonsBlock<T>, comp: ComponentRef<BlockComponent>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<BlockComponent> 
{

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,

    endpoint: 'Rectangle',
    anchor: "Left"
  });

  return comp;
}