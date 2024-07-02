import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow text input field
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson/components#textinput
 */
export interface FlowTextInput extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** Input type - Optional. When set, helps with validation */
  "input-type"?: FlowTextInputTypes;

  /** The label to show on the input */
  label: string;

  /** Whether the input is required */
  required: boolean;

  /** Optional helper text. Max 80 characters. */
  "helper-text"?: string;

  /** Minimum number of characters */
  "min-chars"?: number;
  /** Maximum number of characters */
  "max-chars"?: number;

  /** Show/hide the form field */
  visible?: boolean;

  type: FlowPageLayoutElementTypesV31.TEXT_INPUT;
}

/**
 * Input type. When set, helps with validation.
 */
export enum FlowTextInputTypes {
  Text     = 'text',
  Number   = 'number',
  Email    = 'email',
  Password = 'password',
  /** Numeric password */
  Passcode = 'passcode',
  Phone    = 'phone'
}