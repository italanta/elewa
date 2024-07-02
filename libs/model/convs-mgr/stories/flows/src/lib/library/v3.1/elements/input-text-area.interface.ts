import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow text input field
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson/components#textentry
 */
export interface FlowTextAreaInput extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input. Max 20 characters */
  label: string;

  /** Whether the input is required */
  required: boolean;

  /** Optional helper text. Max 80 characters */
  "helper-text"?: string;

  /** Show/hide the form field */
  visible?: boolean;

  /** Editable or not */
  enabled?: boolean;

  type: FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT;
}
