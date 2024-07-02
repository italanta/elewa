import { FlowClickActionV31 } from "../actions/flow-actions.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Page footer
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson/components#foot
 */
export interface FlowPageFooterV31<T> extends FlowPageLayoutElementV31
{
  /** The label to show on the footer button. Max 35 chars */
  label: string;

  /** Navigation/Next step action */
  "on-click-action": FlowClickActionV31;

  /** Can set left-caption and right-caption or only center-caption, but not all 3 at once */
  "left-caption": string;

  /** Can set left-caption and right-caption or only center-caption, but not all 3 at once */
  "right-caption": string;

  /** Can set left-caption and right-caption or only center-caption, but not all 3 at once */
  "center-caption": string;

  enabled: boolean;

  type: FlowPageLayoutElementTypesV31.FOOTER;

}
