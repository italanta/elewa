import { IObject } from "@iote/bricks";

import { LMSLaunchData } from "./lms-launch-data.interface";
import { AUStatus } from "./au-status.interface";

/**
 * This is created by the LMS and is used to track the learner's progress through the course.
 * 
 * It should be created before launching the AU as the session ID will be referrenced by the
 *  AU in all subsequent requests
 */
export interface LearnerSession extends IObject
{
  /** The id of the AU that the learner is currently on */
  currentUnit: string;

  /** The configuration and rules of a particular Assignable Unit. */
  stateData: LMSLaunchData;

  /** The time the  */
  start: Date;

  learnerId: string;

  completionDate?: Date;

  /** The status of the learner's AU progress through the course */
  activityStatus: AUStatus[];
}