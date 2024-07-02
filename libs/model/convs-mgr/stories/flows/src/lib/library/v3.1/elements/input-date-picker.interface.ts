import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow text input field
 */
export interface FlowDatePickerInput extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input */
  label: string;

  /** Whether the input is required */
  required: boolean;

  /** Optional helper text */
  "helper-text"?: string;

  type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT;
}
