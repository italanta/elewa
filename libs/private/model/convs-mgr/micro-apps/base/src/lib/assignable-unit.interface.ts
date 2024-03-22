import { IObject } from "@iote/bricks";

import { LaunchMethodTypes } from "./launch-method-types.enum";
import { MoveOnTypes } from "./move-on-types.enum";

/** A learning content presentation launched from an LMS. The AU is the unit of tracking and management. 
 *    The AU collects data on the learner and sends it to the LMS 
 * 
 * This interface contains the configuration of the AU as specified in the manifest.
 * */
export interface AssignableUnit extends IObject
{
  /** 
   * This is the id that is used to reference the AU in the course structure.
   * 
   * Should be generated in the following manner:
   *    auId = `${courseId}/${randomCode}`
   * 
   * This is so that we can identify the AU in the course structure.
   */
  id: string;

  /** The title of the learning activity */
  title: string;

  /** The description of the learning activity */
  description?: string;

  /** The id provided by the third party platform e.g. Articulate */
  externalId: string;

  /** The criteria which should be met by the learner to mark the learning activity
   *   as successful
   */
  moveOn: MoveOnTypes;

  /** 
   * Indicates the minimum score that a learner must achieve to pass a course 
   *      or an activity
   * 
   * The masteryScore is a scaled, decimal value between 0 and 1 
   * (inclusive) with up to 4 decimal places of precision. 
   * 
   * The LMS MUST include a masteryScore in the LMS.LaunchData State document 
   *    if the masteryScore was defined by the course designer in the Course Structure
   * */
  masteryScore?: number;

  /**
   * Indicates how the Assignable Unit (AU) should be launched by 
   *    the Learning Management System - CLM
   */
  launchMethod: LaunchMethodTypes;

  /** Contains any additional parameters that the AU may need to launch. 
   * 
   * The launchParameters property is optional and can be defined by the course 
   *    designer in the manifest file.
   * */
  launchParameters?: string;

  /** Id of the next AU (if available). This is so that we can know which AU to navigate to
    *  once the user satisfies the moveOn criteria of the current AU.
    */
  nextUnit?: string;

  /** URL path to the .html file that launches the AU. This is also defined in the manifest
   *    under the <au> tag as <url>PathToCourse/index.html</url>
   */
  urlPath: string;
}

/** 
 * Gives further details representing a measured outcome relevant to the specified Verb. 
 * 
 * Usually included in the xAPI statement sent by the AU after the learner has completed the activity.
 */
export interface AUResult 
{
  score: {
    scaled: number;
    raw: number;
    min: number;
    max: number;
  };

  success: boolean;
  completion: boolean;
  response: string;
  duration: string;
}