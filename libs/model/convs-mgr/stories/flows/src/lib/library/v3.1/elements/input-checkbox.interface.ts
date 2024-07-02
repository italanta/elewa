import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";
import { FlowInlineOptionV31 } from "./flow-option.interface";

/**
 * In-line checkbox input (in-line meaning they will show )
 */
export interface FlowInlineCheckboxInputV31 extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input */
  label: string;

  /** Whether the input is required */
  required: boolean;

  /** Checbox data source */
  "data-source": FlowInlineOptionV31[];

  /** Minimum number of selected items. Min 1 */
  "min-selected-items"?: number;

  /** Maximum number of selected items. Min 1, max 20 */
  "max-selected-items"?: number;

  /** Editable or not */
  enabled: boolean;

  /** Visible or not */
  visible: boolean;

  /** Do data exchange on every select */
  "on-select-action"?: {
    name: "data_exchange",
    payload: FlowDynamicData 
  };

  // V4.0 feature
  // description?: string;

  type: FlowPageLayoutElementTypesV31.INLINE_CHECKBOX_INPUT;
}
