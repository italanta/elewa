import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";
import { FlowInlineOptionV31 } from "./flow-option.interface";

/**
 * Out-line (clicking this opens new screen with options) options input
 */
export interface FlowDatepickerInputV31 extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input */
  label: string;

  /** Whether the input is required */
  required: boolean;

  type: FlowPageLayoutElementTypesV31.INLINE_CHECKBOX_INPUT;
}