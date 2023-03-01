import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { StoryEditorState } from '@app/state/convs-mgr/story-editor';


export function CreateDeleteButton() {
  // Create a button element
  let deleteButton = document.createElement("button");

  // Set the innerHTML of the button to display a trash icon
  deleteButton.innerHTML = "<i class='fas fa-trash'></i>";

  // Set the class for the  styles for the button
  deleteButton.id = "overlay-delete-button";
  // deleteButton.classList.add("overlay-button ");

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
