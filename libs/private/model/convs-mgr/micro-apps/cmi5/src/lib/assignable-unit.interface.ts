import { IObject } from "@iote/bricks";

import { LaunchMethodTypes, MoveOnTypes } from "./launch-data.interface";

export interface AssignableUnit extends IObject
{
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