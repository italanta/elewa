import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BlockComponent } from "@app/features/convs-mgr/stories/blocks/library/main";

/**
 * Decorates MessageBlock with JS plumb connectors.
 * 
 * @param block   - TextMessageBlock data structure.
 * @param comp    - Angular component within the viewport 
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _MessageBlockDecoratePlumb(block: TextMessageBlock, comp: ComponentRef<BlockComponent>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<BlockComponent> 
{

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,
    endpoint: 'Rectangle',
    anchor: "Left"
  });

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    source: true,
    endpoint: 'Dot',
    anchor: "Right"
  });

  return comp;
}