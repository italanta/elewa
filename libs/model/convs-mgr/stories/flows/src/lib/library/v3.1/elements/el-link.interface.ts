import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow embedded link.
 */
export interface FlowEmbeddedLink extends FlowPageLayoutElementV31
{
  /** Image source */
  text: string;

  /** Nav action */
  "on-click-action"?: {
    /** Action name */
    name: 'navigate',
    /** Next screen */
    next: {
      type: 'screen',
      name: string;
    }
    payload: FlowDynamicData 
  };

  /** Data payload */
  payload: FlowDynamicData;
  
  type: FlowPageLayoutElementTypesV31.LINK
}

