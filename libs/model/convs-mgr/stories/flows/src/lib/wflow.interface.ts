import { IObject } from '@iote/bricks';
import { FlowJSONV31 } from './library/v3.1/flow-json.interface';

/**
 * Represents a whatsapp flow micro-app that can be loaded ontop of the Whatsapp flows API.
 *
 * - Follows a temporal design, where the latest timestamp acts as source of truth.
 * - Stored at orgs/${orgId}/stories/${storyId}/config/{timestamp}
 * -    Story at ../stories/${storyId} must be of Module Type = Flow
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowsapi/
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson#static-validation-errors
 */
export interface WFlow extends IObject
{
  /** Flow payload (design) */
  flow: FlowJSONV31;

  /** ID of source Flow to clone. You must have permission to access the specified Flow. */
  clone_flow_id?: string;

  /**
   * List of issues meta noticed with the flow. They need to be solved before
   *  flow can be published.
   */
  validation_errors: string[];

  /**
   * Channel to preview this version of the flow.
   */
  preview: {
    /** URL on which to preview the flow. */
    preview_url: string,
    /** Date time the flow will become deprecated. (ISO date string e.g. "2023-05-21T11:18:09+0000") */
    expires_at: string;
  }
}
