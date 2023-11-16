import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ConditionalBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BlockComponent } from "@app/features/convs-mgr/stories/blocks/library/main";

/**
 * Decorates ConditionalBlock with JS plumb connectors.
 * 
 * @param block   - LisxstMessageBlock data structure.
 * @param comp    - Angular component within the viewport 
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _ConditionalBlockDecoratePlumb(block: ConditionalBlock, comp: ComponentRef<BlockComponent>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<BlockComponent> 
{

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,
    cssClass:"block_endpoint",

    endpoint: 'Dot',
    anchor: "Left",
    maxConnections: -1

  });
  return comp;
}