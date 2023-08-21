import { IObject } from "@iote/bricks";

import { LMSLaunchData } from "./lms-launch-data.interface";
import { AUStatus  } from "./assignable-unit.interface";

/**
 * This is created by the LMS and is used to track the learner's progress through the course.
 * 
 * It is created before launching the AU
 */
export interface LearnerSession extends IObject
{
  /** The id of the AU that the learner is currently on */
  currentUnit: string;

  stateData: LMSLaunchData;

  start: Date;

  learnerId: string;

  completionDate?: Date;

  /** The status of the learner's AU progress through the course */
  auStatus: AUStatus[];
}