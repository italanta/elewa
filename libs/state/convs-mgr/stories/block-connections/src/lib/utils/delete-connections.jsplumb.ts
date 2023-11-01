import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";

import { StoryBlockConnection } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Removes an array of connections from jsplumb
 */
export function DeleteConnectors(jsPlumb: BrowserJsPlumbInstance, connections: StoryBlockConnection[]) {

  // Get an array of all connections using the jsPlumb library
  let allConnections: any = jsPlumb.getConnections();

  // Filter the connections obtained from the jsPlumb library to be deleted
  let dCon = allConnections.filter((newConn: any) => !connections.find((allCon: any) => newConn.id === allCon.id));

  // Delete each filtered connection using the jsPlumb.deleteConnection method
  dCon.forEach((cn: any) => {
    jsPlumb.deleteConnection(cn);
    
  });
}