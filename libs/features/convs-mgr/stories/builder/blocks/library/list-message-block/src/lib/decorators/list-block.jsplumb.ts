import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 * Decorates MessageBlock with JS plumb connectors.
 * 
 * @param block   - LisxstMessageBlock data structure.
 * @param comp    - Angular component within the viewport 
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _ListBlockDecoratePlumb(block: ListMessageBlock, comp: ComponentRef<any>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<any> 
{

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,
    cssClass:"block_endpoint",
    endpoint: 'Rectangle',
    anchor: "Left",
    maxConnections: -1

  });

  return comp;
}