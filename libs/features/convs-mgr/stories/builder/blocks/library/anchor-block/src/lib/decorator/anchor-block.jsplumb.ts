import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

/**
 * Decorates @see {AnchorBlockComponent} with JS plumb connectors.
 * 
 * @param block   - AnchorMessageBlock data structure.
 * @param comp    - Angular component within the viewport (typeof ComponentRef<StoryBlock>)
 * @param jsPlumb - Active jsPlumb instance
 * 
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _AnchorBlockDecoratePlumb(comp: ComponentRef<any>, jsPlumb: BrowserJsPlumbInstance) : ComponentRef<any> 
{

  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,
    cssClass:"block_endpoint",
    endpoint: 'Rectangle',
    anchor: "Left"
  });

  return comp;
}