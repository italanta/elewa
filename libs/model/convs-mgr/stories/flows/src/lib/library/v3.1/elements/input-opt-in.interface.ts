import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";
import { FlowInlineOptionV31 } from "./flow-option.interface";

/**
 * Single click opt-in field
 */
export interface InputOptInV31 extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input */
  label: string;

  /** Whether the input is required */
  required: boolean;

  /**  Viewable or not */
  visible?: boolean;

  /** Configure "Read more" button */
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

  type: FlowPageLayoutElementTypesV31.OPT_IN;
}
