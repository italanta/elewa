/**
 * Indicates how the Assignable Unit (AU) should be launched by 
 *    the Learning Management System - CLM
 */
export enum LaunchMethodTypes
{
  /** Spawning a new browser window for the AU. */
  OwnWindow = 'ownWindow',

  /** Re-directing the existing browser window to the AU */
  AnyWindow = 'anyWindow'
}