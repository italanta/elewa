import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import { BezierConnector } from "@jsplumb/connector-bezier";
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
    endpoint: 'Dot',
    // Where to position the anchor
    anchor: "Right",
    connector: {
      // type: BezierConnector.type,
        type: FlowchartConnector.type,
      options: { 
        curviness: 100
      }
    }
    

  });  return sourceElement;
}
