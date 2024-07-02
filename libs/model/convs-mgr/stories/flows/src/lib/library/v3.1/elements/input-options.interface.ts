import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";
import { FlowInlineOptionV31 } from "./flow-option.interface";

/**
 * Out-line (clicking this opens new screen with options) options input
 */
export interface FlowOptionsInputV31 extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input */
  label: string;

  /** Whether the input is required */
  required: boolean;

  /** Checbox data source */
  "data-source": FlowInlineOptionV31[];

  /** Show/hide the form field */
  visible?: boolean;

  /** Editable or not */
  enabled?: boolean;

  /** Do data exchange on every select */
  "on-select-action"?: {
    name: "data_exchange",
    payload: FlowDynamicData 
  };

  /** Minimum number of selected items. Min 1 */
  "min-selected-items"?: number;

  /** Maximum number of selected items. Min 1, max 200 */
  "max-selected-items"?: number;

  type: FlowPageLayoutElementTypesV31.INLINE_CHECKBOX_INPUT;
}
