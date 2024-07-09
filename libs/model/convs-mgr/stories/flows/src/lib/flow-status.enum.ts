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