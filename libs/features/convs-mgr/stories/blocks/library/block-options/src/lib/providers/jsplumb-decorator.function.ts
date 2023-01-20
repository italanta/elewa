import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import { FlowchartConnector } from "@jsplumb/connector-flowchart";

/**
 * This function adds jsPlumb endpoints to rendered components. 
 *  The rendering location will depend on the type and configuration of the source.
 * 
 * @param sourceElement    - Angular component rendered in the viewport 
 * @param jsPlumb - Active jsPlumb instance
 */

export function _JsPlumbComponentDecorator(sourceElement: Element, jsPlumb: BrowserJsPlumbInstance): Element
{
  jsPlumb.addEndpoint(sourceElement, {
    source: true,
    // Type of endpoint to render
    cssClass:"block_endpoint",
    endpoint: 'Dot',
    // Where to position the anchor
    anchor: "Left",
    connector : FlowchartConnector.type
  });  
  return sourceElement;
}
