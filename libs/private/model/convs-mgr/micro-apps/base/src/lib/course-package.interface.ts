import { IObject } from "@iote/bricks";

export interface CoursePackage extends IObject
{
  title: string;
  
  description?: string;
  
  /** The id provided by the third party platform e.g. Articulate */
  externalId: string;
  
  /** A listing of objectives referenced by this block as defined by the 
   * course designer
   */
  objectives: CourseObjective[];

  firstAU: string;
}

/** A listing of objectives referenced by this block as defined by the 
 * course designer
 */
export interface CourseObjective {
  id: string;
  title: string;
  description?: string;
}