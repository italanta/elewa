import { IObject } from "@iote/bricks";

import { LaunchMethodTypes, MoveOnTypes } from "../../../cmi5/src/lib/cmi5-launch-data.interface";
import { AUStatusTypes } from "./au-status-types.enum";

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


  title: string;

  description?: string;

  /** The id provided by the third party platform e.g. Articulate */
  externalId: string;

  moveOn: MoveOnTypes;

  masteryScore: number;

  launchMethod: LaunchMethodTypes;

  launchParameters?: string;

  /** Id of the next AU (if available). This is so that we can know which AU to navigate to
    *  once the user satisfies the moveOn criteria of the current AU.
    */
  nextUnit?: string;

  /** URL path to the .html file that launches the AU */
  urlPath: string;
}

export interface AUStatus
{
  /** The id of the AU */
  id: string;
  status: AUStatusTypes;
  completionDate?: Date;

  score?: number;
}

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