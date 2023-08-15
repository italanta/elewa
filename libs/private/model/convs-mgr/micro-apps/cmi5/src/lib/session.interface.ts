import { IObject } from "@iote/bricks";

import { LMSLaunchData } from "./launch-data.interface";

/**
 * This is created by the LMS and is used to track the learner's progress through the course.
 * 
 * It is created before launching the AU
 */
export interface LearnerSession extends IObject {
  /** The id of the AU that the learner is currently on */
  currentUnit: string;

  stateData: LMSLaunchData;

  /** The unique identifier for this session */
  id: string;

  start: Date;

  learnerId: string;

  authCode: string;

  /** The id of the course that this session belongs to */
  courseId: string;

  completionDate?: Date;
}