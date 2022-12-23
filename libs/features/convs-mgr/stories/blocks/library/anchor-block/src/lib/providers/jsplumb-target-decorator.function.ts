import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import { FlowchartConnector } from "@jsplumb/connector-flowchart";

/**
 * This function adds jsPlumb endpoints to rendered components. 
 *  The rendering location will depend on the type and configuration of the source.
 * 
 * @param sourceElement    - Angular component rendered in the viewport 
 * @param jsPlumb - Active jsPlumb instance
 */

export function _JsPlumbTargetComponentDecorator(sourceElement: Element, jsPlumb: BrowserJsPlumbInstance): Element
{
  jsPlumb.addEndpoint(sourceElement, {
    target: true,
    // Type of endpoint to render
    endpoint: 'Dot',
    // Where to position the anchor
    anchor: "Right",
    connector : FlowchartConnector.type
  });  
  return sourceElement;
}
