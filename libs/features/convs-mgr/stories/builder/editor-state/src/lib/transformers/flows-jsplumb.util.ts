import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

/**
 * Decorates two div elements with JS plumb connectors.
 * 
 * @param div1    - The first HTML div element.
 * @param div2    - The second HTML div element.
 * @param jsPlumb - Active jsPlumb instance
 */
export function connectDivsWithJsPlumb(div1: HTMLElement, div2: HTMLElement, jsPlumb: BrowserJsPlumbInstance): void {
  // Manage the div elements in jsPlumb
  jsPlumb.manage(div1);
  jsPlumb.manage(div2);

  // Add endpoints to the first div
  jsPlumb.addEndpoint(div1, {
    target: true,
    cssClass: 'div_endpoint',
    endpoint: 'Rectangle',
    anchor: "Top",
    maxConnections: 1,
    connector: {
        type: 'Flowchart',
        options: {
          cssClass: 'framee-connector',
          cornerRadius: 100
        },
      },
  });

  // Add endpoints to the second div
  jsPlumb.addEndpoint(div2, {
    source: true,
    cssClass: 'div_endpoint2',
    endpoint: 'Dot',
    anchor: "Left",
    maxConnections: 1,
    connector: {
        type: 'Flowchart',
        options: {
          cssClass: 'framee-connector',
          cornerRadius: 100
        },
      },
  });

  // Connect the two divs
  jsPlumb.connect({
    source: div1,
    target: div2
  });
}
