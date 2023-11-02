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

   // Add event listener for mouseover event
   deleteButton.addEventListener("mouseover", () => {
    deleteButton.title = "Double click to delete";
  });

  // Return the created button
  return deleteButton
}

/**
 * Deletes jsplumb connections by id
 * 
 * @param jsPlumb Current instance of jsplumb
 * @param connectionId The id of the connection to be deleted. Pulled from overlayData.overlay.id
 */
export function DeleteConnectorbyID(jsPlumb: BrowserJsPlumbInstance, connectionId: string) {
  // Get an array of all connections using the jsPlumb library
  const connections: any = jsPlumb.getConnections();

  // Filter the connections obtained from the jsPlumb library by the filtered connection ID
  const dCon = connections.filter((c: any) => (c.uuids[0] === connectionId));

  // Delete each filtered connection using the jsPlumb.deleteConnection method
  dCon.forEach((cn: any) => {
    jsPlumb.deleteConnection(cn);
  });
}
