import { ComponentRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { AssessmentBrick } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BlockComponent } from '@app/features/convs-mgr/stories/blocks/library/main';

/**
 * Decorates AssessmentBrick with JS plumb connectors.
 *
 * @param block   - AssessmentBrick data structure.
 * @param comp    - Angular component within the viewport
 * @param jsPlumb - Active jsPlumb instance
 *
 * @see {_JsPlumbComponentDecorator} - Should be the only one calling the component
 */
export function _AssessmentBrickDecoratePlumb(
  block: AssessmentBrick,
  comp: ComponentRef<BlockComponent>,
  jsPlumb: BrowserJsPlumbInstance
): ComponentRef<BlockComponent> {
  jsPlumb.addEndpoint(comp.location.nativeElement, {
    // Whether the anchor is target (Other Block -> This Block)
    target: true,
    cssClass: 'block_endpoint',
    endpoint: 'Dot',
    anchor: [0, 0.11 , 0, 1],
    maxConnections: -1,
  });

  return comp;
}
