/**
 * Specifications and config for the delete connection overlay
 */
export const DeleteConnOverlaySpec = {
  // Specify the type of overlay as "Custom"
  type: 'Custom',
  options: {
    // Set the id of the overlay to the connection id
    id: "deleteConnection",
    create: (component: any, conn: any) =>
    {
      // Create the delete button element and return it
      return CreateDeleteButton();
    },
    // Set the location of the overlay as 0.5
    location: 0.5,
    events: {
      // Add a double-click event to the overlay
      dblclick: ((overlayData: any) => DeleteConnector(overlayData)).bind(this)
    },
  },
};

function DeleteConnector(overlayData: any)
{
  const connections = overlayData.overlay.instance.connections;
  const connectionId = overlayData.overlay.component.id;
  // Get an array of all connections using the jsPlumb library
  // const connections: any = jsPlumb.getConnections();

  // Filter the connections obtained from the jsPlumb library by the filtered connection ID
  const dCon = connections.filter((c: any) => (c.id === connectionId));

  // Delete each filtered connection using the jsPlumb.deleteConnection method
  dCon.forEach((cn: any) =>
  {
    overlayData.overlay.instance.deleteConnection(cn);
  });

  overlayData.overlay.instance.repaintEverything();
}


function CreateDeleteButton()
{
  // Create a button element
  const deleteButton = document.createElement("button");

  // Set the innerHTML of the button to display a trash icon
  deleteButton.innerHTML = "<i class='fas fa-trash'></i>";

  // Set the class for the  styles for the button
  deleteButton.id = "overlay-delete-button";
  // deleteButton.classList.add("overlay-button ");

  // Add event listener for mouseover event
  deleteButton.addEventListener("mouseover", () =>
  {
    deleteButton.title = "Double click to delete";
  });

  // Return the created button
  return deleteButton;
}
