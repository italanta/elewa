import { IObject } from "@iote/bricks";

import { EnrolledEndUser } from "@app/model/convs-mgr/learners";

/**
 * This interface extends the IObject interface from the "@iote/bricks" module.
 */
export interface UserGroups extends IObject {
  /**
   * The name of the user group.
   */
  name: string;

  /**
   * An array of enrolled end users belonging to the user group.
   */
  users?: EnrolledEndUser[];

  /**
   * A description providing additional information about the user group.
   */
  description: string;

  /**
   * The course associated with the user group.
   */
  course?: string;
}
