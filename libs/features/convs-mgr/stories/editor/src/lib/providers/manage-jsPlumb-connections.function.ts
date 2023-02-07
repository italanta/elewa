
import { StoryEditorState } from '@app/state/convs-mgr/story-editor';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';


export function CreateDeleteButton() {
  // Create a button element
  let deleteButton = document.createElement("button");

  // Set the innerHTML of the button to display a trash icon
  deleteButton.innerHTML = "<i class='fas fa-trash' style='color: red; font-size: 16px;'></i>";

  // Set the styles for the button
  deleteButton.style.backgroundColor = "#ffffff";
  deleteButton.style.border = "none";
  deleteButton.style.borderRadius = "30px";
  deleteButton.style.padding = "4px 4px 3px 4px";
  deleteButton.style.cursor = "pointer";

  // Return the created button
  return deleteButton
}

export function DeleteConnectorbyID(jsPlumb: BrowserJsPlumbInstance, state: StoryEditorState, overlayData: any) {
  // Get an array of connections from the state object
  let conArray: any = state.connections;

  // Get an array of all connections using the jsPlumb library
  let del: any = jsPlumb.getConnections();

  // Filter the connections in the state object by the connection ID in the overlayData object
  let con = conArray.find((c: any) => c.id == overlayData.overlay.id);

  // Filter the connections obtained from the jsPlumb library by the filtered connection ID
  let dCon = del.filter((c: any) => (c.uuids[0] == con.id));

  // Delete each filtered connection using the jsPlumb.deleteConnection method
  dCon.forEach((cn: any) => {
    jsPlumb.deleteConnection(cn);
  });
}
