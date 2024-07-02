import { IObject } from '@iote/bricks';
import { FlowJSONV31 } from './library/v3.1/flow-json.interface';

/**
 * Represents a flow micro-app that can be loaded ontop of the Whatsapp flows API.
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowsapi/
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson#static-validation-errors
 */
export interface Flow extends IObject
{
  /** Flow name */
  name: string;

  /** Status of the flow */
  status: FlowStatus;

  /** Flow payload (design) */
  flow: FlowJSONV31;
  
  /** 
   * Flow category (must be one or more) 
   * Multiple values are possible, but at least one is required. Choose the values which represent your business use case.
   */
  categories: FlowCategories[];

  /** ID of source Flow to clone. You must have permission to access the specified Flow. */
  clone_flow_id?: string;

  /**
   * The URL of the WA Flow Endpoint. Starting from Flow JSON version 3.0 this property should be specified only via API. Do not provide this field if you are cloning a Flow with Flow JSON version below 3.0.
   */
  endpoint_uri: string;

  /**
   * List of issues meta noticed with the flow. They need to be solved before
   *  flow can be published.
   */
  validation_errors: string[];

  /**
   * Channel to preview the flow.
   */
  preview: {
    /** URL on which to preview the flow. */
    preview_url: string,
    /** Date time the flow will become deprecated. (ISO date string e.g. "2023-05-21T11:18:09+0000") */
    expires_at: string;
  }
}

/**
 * Each flow must be assigned a category that represents their utility type.
 */
export enum FlowCategories
{
  SIGN_UP= 'SIGN_UP',
  SIGN_IN= 'SIGN_IN',
  APPOINTMENT_BOOKING='APPOINTMENT_BOOKING',
  LEAD_GENERATION='LEAD_GENERATION',
  CONTACT_US='CONTACT_US',
  CUSTOMER_SUPPORT='CUSTOMER_SUPPORT',
  SURVEY='SURVEY',
  OTHER='ORTHER'
}

/** 
 * Possible statusses of the flow
 */
export enum FlowStatus 
{
  /** This is the initial status. The Flow is still under development. The Flow can only be sent with "mode": "draft" for testing. */
  DRAFT = 'DRAFT',

  /** The Flow has been marked as published by the developer so now it can be sent to customers. This Flow cannot be deleted or updated afterwards. */
  PUBLISHED = 'PUBLISHED',

  /** The developer has marked the Flow as deprecated (since it cannot be deleted after publishing). This prevents sending and opening the Flow, to allow the developer to retire their endpoint. Deprecated Flows cannot be deleted or undeprecated. */
  DEPRECATED = 'DEPRECATED',
  
  /** 
   * Monitoring detected that the endpoint is unhealthy and set the status to Blocked. 
   * The Flow cannot be sent or opened in this state; the developer needs to fix the endpoint to get it 
   * back to Published state (more details in Flows Health and Monitoring @see https://developers.facebook.com/docs/whatsapp/flows/reference/healthmonitoring). */
  BLOCKED = 'BLOCKED',

  /** 
   * Monitoring detected that the endpoint is unhealthy and set the status to Throttled.
   * Flows with throttled status can be opened, however only 10 messages of the Flow could be sent per hour. The developer needs to fix the endpoint to get it back to the PUBLISHED state 
   * (more details in Flows Health and Monitoring https://developers.facebook.com/docs/whatsapp/flows/reference/healthmonitoring).
   */
  THROTTLED = 'THROTTLED'
}