import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { AudioInputBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 * Decorates MessageBlock with JS plumb connectors.
 * 
 * @param block   - TextMessageBlock data structure.
 * @param comp    - Angular component within the viewport (typeof ComponentRef<StoryBlock>)
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _AudioInputBlockDecoratePlumb(block: AudioInputBlock, comp: ComponentRef<any>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<any> 
{

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,
    cssClass:"block_endpoint",
    endpoint:'Rectangle',
    anchor: "Left",
    maxConnections: -1
  });

  return comp;
}