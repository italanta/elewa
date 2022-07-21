import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { BezierConnector } from "@jsplumb/connector-bezier"


import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BlockComponent } from "../block/block.component";

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
    // Whether the anchor is source (This Block -> Other Block)
    source: true,

    // Type of endpoint to render
    endpoint: 'Dot',
    // Where to position the anchor
    anchor: "Right",
    connector: {
      type: BezierConnector.type,
      options: { 
        curviness: 100
      }
    }
  });

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,

    endpoint: 'Rectangle',
    anchor: "Left"
  });

  return comp;
}