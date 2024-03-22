import { AUStatusTypes } from "./au-status-types.enum";

/** 
 * The learner status in the AU/Learning Activity 
 * 
 * When we receive an update from the AU, this is how we record
 *  the learner status of that particular AU.
 */
export interface AUStatus
{
  /** The id of the AU */
  id: string;

  /** The status of the AU */
  status: AUStatusTypes;

  /** Time the activity was completed */
  completionDate?: Date;

  /** 
   * The final score of the learner in the AU. 
   * 
   * Only available when it is a measured activity e.g. Questions
   */
  score?: number;
}