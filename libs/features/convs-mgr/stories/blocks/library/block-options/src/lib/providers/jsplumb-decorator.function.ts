import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import { FlowchartConnector } from "@jsplumb/connector-flowchart";

/**
 * This function adds jsPlumb endpoints to rendered option blocks. 
 *  The rendering location will depend on the type and configuration of the source.
 * 
 * @param sourceElement    - Angular component rendered in the viewport 
 * @param jsPlumb - Active jsPlumb instance
 */

export function _JsPlumbInputOptionDecorator(sourceElement: Element, jsPlumb: BrowserJsPlumbInstance): Element
{
  jsPlumb.addEndpoint(sourceElement, {
    source: true,
    // Type of endpoint to render
    cssClass:"block_endpoint",
    endpoint: 'Dot',
    // Where to position the anchor
    anchor: "Right",
    connector: {
      type: 'Flowchart',
      options: {
        cssClass: 'frame-connector',
        cornerRadius: 100
      },
    },
  });  
  return sourceElement;
}
