


import { FlowJSONV31, FlowPageLayoutElementV31, FlowScreenV31 } from "@app/model/convs-mgr/stories/flows";

import { FlowBuilderStateFrame } from "../model/flow-builder-state-frame.interface";
import { getUUID } from "./get-uuid.util";

/**
 * Build the FlowJSONV31 object
 */
export function buildFlowJSON(state: FlowBuilderStateFrame, update: FlowPageLayoutElementV31, screen = 0): FlowJSONV31
{
  // Group controls by screen
  let allScreens = state.flow.flow.screens;

  let updatedScreen: FlowScreenV31;

  if(!allScreens || allScreens.length === 0) {
    updatedScreen = getScreen(screen.toString(), [update]);
    allScreens = [updatedScreen];
  } else {
    let existingElements = allScreens[screen].layout.children;

    if(existingElements?.length > 0) {
      existingElements.push(update);
    } else {
      existingElements = [update];
    }

    allScreens[screen] = getScreen(screen.toString(), existingElements)
  }


  return {
    id: getUUID(),
    version: '3.1',
    screens: allScreens,
    data_api_version: '3.0',
    routing_model: buildRoutingModel(allScreens),
  };
}

  /**
   * Create a single screen from a controlId and its new value
   */
  function getScreen(screenId: string, controls: FlowPageLayoutElementV31[]): FlowScreenV31 {
    return {
      id: screenId,
      layout: {
        type: 'SingleColumnLayout',
        children: controls,  // Grouped controls for this screen
      },
      title: `SCREEN ${screenId +1}`,
    };
  }
  
  /**
   * Build routing model for screen navigation
   */
  function buildRoutingModel(screens: FlowScreenV31[]): { [screen_name: string]: string[] } {
    const routing: { [screen_name: string]: string[] } = {};
    screens.forEach((screen, index) => {
      if (index < screens.length - 1) {
        routing[screen.id] = [screens[index + 1].id];  // Link to next screen
      }
    });
    return routing;
  }
