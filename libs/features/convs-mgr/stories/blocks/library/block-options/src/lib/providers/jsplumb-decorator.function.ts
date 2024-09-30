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
  // Clear all endpoints attached to the source element before reattaching an endpoint
  //  Without this, jsPlumb does not calculate the position of an endpoint properly after deleting
  //   an element(an option), hence when you readd an option it will not have an endpoint until 
  //    the page is refreshed.

  // Fixes #CLM-405 - Sometimes when adding options, no connector point is linked to new option
  jsPlumb.removeAllEndpoints(sourceElement);

  jsPlumb.addEndpoint(sourceElement, {
    source: true,
    // Type of endpoint to render
    cssClass:"block_endpoint",
    endpoint: 'Dot',
    // Where to position the anchor
    anchor: [1, 0.5, 0, 0, 16, 0],
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
