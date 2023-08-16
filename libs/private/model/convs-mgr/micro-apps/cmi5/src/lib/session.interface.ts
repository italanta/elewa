import { IObject } from "@iote/bricks";

import { LMSLaunchData } from "./launch-data.interface";
import { AUStatus } from "./au-status-types.enum";

/**
 * This is created by the LMS and is used to track the learner's progress through the course.
 * 
 * It is created before launching the AU
 */
export interface LearnerSession extends IObject {
  /** The id of the AU that the learner is currently on */
  currentUnit: string;

  stateData: LMSLaunchData;

  start: Date;

  learnerId: string;

  /** The id of the course that this session belongs to */
  courseId: string;

  completionDate?: Date;

  /** The status of the learner's AU progress through the course */
  status: AUStatus;
}