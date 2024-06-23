import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FailBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 * Decorates FailBlock with JS plumb connectors.
 * 
 * @param block   - FailBlock data structure.
 * @param comp    - Angular component within the viewport 
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _FailBlockDecoratePlumb(block: FailBlock, comp: ComponentRef<any>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<any> 
{

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,
    cssClass: 'block_endpoint',
    endpoint: 'Rectangle',
    anchor: "Left",
    maxConnections: -1
  });

  return comp;
}