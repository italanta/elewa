import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";

/**
 * An on-click event (e.g. after clicking a button)
 */
export interface FlowClickActionV31
{
  /** Action name */
  name: 'data_exchange' | 'navigate' | 'complete';

  payload: FlowDynamicData;
}

/**
 * An on-click navigation event
 */
export interface FlowClickNavActionV31 extends FlowClickActionV31
{
  /** Action name */
  name: 'navigate';

  /** If navigate, next will be set */
  next: { type: 'screen', name: string;}

  payload: FlowDynamicData;
}

/**
 * A complete event. Ends the flow and communicates that to the backend. Used in terminal screen.
 */
export interface FlowCompleteActionV31
{
  /** Action name -  */
  name: 'complete';

  payload: FlowDynamicData;
}

/**
 * Sends data to WhatsApp Flows Data Endpoint.
 * 
 * Use can only use this action if your Flow is powered by a Data Endpoint. Use this action when you need to submit 
 * data to your server before transitioning to the next screen or terminating the flow. Your server could then decide 
 * on the next step and provide the input for it.
 */
export interface FlowDataExchangeActionV31
{
  /** Action name -  */
  name: 'complete';

  payload: FlowDynamicData;
}
