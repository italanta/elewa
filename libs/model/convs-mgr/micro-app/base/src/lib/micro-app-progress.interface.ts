import { IObject } from "@iote/bricks";
import { MicroAppTypes } from "./micro-app-types.enum";
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
  /** ID of an organization */
  orgId: string;
  /** Current question a user is in */
  milestones?: ProgressMilestones;

  type: MicroAppTypes;
}

export interface ProgressMilestones 
{
   /** Current question ID */
  questionId?: string;
  /** Time spent in the app (in milliseconds) */
  timeSpent?: number;
}
