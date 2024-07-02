import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Date picker allows picking of date
 * 
 * @note ! Currently, the DatePicker doesn't support scenarios where the business and the end user are in different time zones. We recommend only using the component if you plan to send your Flows to users in a specific timezone.
 */
export interface FlowDatepickerInputV31 extends FlowPageLayoutElementV31
{
  /** The input variable name */
  name: string;

  /** The label to show on the input */
  label: string;

  /** Helper text */
  "helper-text": string;

  /** Whether the input is required */
  required: boolean;

  /** 
   * Timestamp in ms
   *  When you specify the date range or set unavailable dates, you should convert your local dates with midnight (00:00:00) as a base time to UTC timestamps.
   */
  "min-date": number;

  /** 
   * Timestamp in ms
   * When you specify the date range or set unavailable dates, you should convert your local dates with midnight (00:00:00) as a base time to UTC timestamps.
   */
  "max-date": number;

  /** 
   * Timestamp in ms [] 
   * When you specify the date range or set unavailable dates, you should convert your local dates with midnight (00:00:00) as a base time to UTC timestamps.
  */
  "unavailable-dates": number[];

  /** Do data exchange on every select */
  "on-select-action"?: {
    name: "data_exchange",
    payload: FlowDynamicData 
  };

  type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT;
}