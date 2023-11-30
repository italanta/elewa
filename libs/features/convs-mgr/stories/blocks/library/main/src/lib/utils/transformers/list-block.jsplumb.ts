import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BlockComponent } from "@app/features/convs-mgr/stories/blocks/library/main";

/**
 * Decorates MessageBlock with JS plumb connectors.
 * 
 * @param block   - LisxstMessageBlock data structure.
 * @param comp    - Angular component within the viewport 
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _ListBlockDecoratePlumb(block: ListMessageBlock, comp: ComponentRef<BlockComponent>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<BlockComponent> 
{

  
  jsPlumb.addEndpoint(comp.location.nativeElement, {
    target: true,
    cssClass:"block_endpoint",
    endpoint: "Dot",
    anchor: [0,0.12,0,1],
    maxConnections: -1

  });
  jsPlumb.addEndpoint(comp.location.nativeElement, {
    target: true,
    cssClass:"block_endpoint",
    endpoint: "Dot",
    anchor: [1,0.58,0,1],
    maxConnections: -1

  });
  jsPlumb.addEndpoint(comp.location.nativeElement, {
    target: true,
    cssClass:"block_endpoint",
    endpoint: "Dot",
    anchor: [1,0.73,0,1],
    maxConnections: -1

  });
 
  
   return comp;


}