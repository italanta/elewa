import { IObject } from "@iote/bricks";
import { MicroAppTypes } from "./micro-app-types.enum";
import { MicroAppSectionTypes } from "./microapp-section-types.enum";
/** Interface representing a progress object, details Gomza is recording as a
 *  user engages with a microap
 *  Useful when routing them back to where they were, and tracking completion 
 * */

export interface MicroAppProgress extends IObject
{
  /** Microapp id */
  appId: string;
  /** Id of the user engaging with the app */
  endUserId: string;

  /** Name of the end user engaging with the app */
  endUserName?: string;
  /** ID of an organization */
  orgId: string;
  /** Type of micro-app, can be course, assessment or custom */
  type: MicroAppTypes;
  /** Measure of micro-app interactions */
  appMilestones?: ProgressMilestones
}

/** 
 *  progress milestones for the case where micro-app is not an assessment
 */
export interface ProgressMilestones 
{
  /** Section in app where user is in */
  appSection: MicroAppSectionTypes;
  /** Time spent in the app (in milliseconds) */
  timeSpent?: number;
}
