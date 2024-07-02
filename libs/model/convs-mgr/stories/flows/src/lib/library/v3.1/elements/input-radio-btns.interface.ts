import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";
import { FlowInlineOptionV31 } from "./flow-option.interface";

/**
 * In-line checkbox input (in-line meaning they will show )
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson/components#radio
 */
export interface FlowInlineRadioButtonsInputV31 extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input. Max 20 characters. */
  label: string;

  /** Whether the input is required */
  required: boolean;

  /** Editable or not */
  enabled: boolean;

  /** Visible or not */
  visible: boolean;

  /** Radio buttons data source */
  "data-source": FlowInlineOptionV31[];

  /** Do data exchange on every select */
  "on-select-action"?: {
    name: "data_exchange",
    payload: FlowDynamicData 
  };

  /** Minimum number of selected items. Min 1 */
  "min-selected-items"?: number;

  /** Maximum number of selected items. Min 1, max 20 */
  "max-selected-items"?: number;

  // V4.0 feature
  // description?: string;

  type: FlowPageLayoutElementTypesV31.INLINE_RADIO_BUTTONS;
}

