/** Interface representing a progress object, details Gomza is recording as a
 *  user engages with a microap
 *  Useful when routing them back to where they were, and tracking completion 
 * */

export interface MicroAppProgrress 
{
  /** Microapp id */
  appId: string,
  /** Id of the user engaging with the app */
  endUserId: string,
  /** ID of an organization */
  orgId: string,

  // The payload to be sent to save current progress
  payload: object | null,
}
