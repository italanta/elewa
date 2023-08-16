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

  start: Date;

  learnerId: string;

  /** The id of the course that this session belongs to */
  courseId: string;

  completionDate?: Date;

  /** The status of the learner's AU progress through the course */
  status: AUStatus;
}

/** The status of the learner's AU progress through the course */
export enum AUStatus { 
  /** This verb indicates that the AU was launched by the LMS */
  Launched = "Launched", // ---- Set by LMS

  /** An "initialized" statement is used by the AU to indicate that it has 
   *    been fully initialized. The "initialized" statement MUST follow, within a 
   *      reasonable period of time, the "launched" statement created by the LMS. */
  Initialized = "Initialized", // ---- Set by AU

  /** The verb indicates the learner viewed or did all of the relevant 
   *  activities in an AU presentation. */
  Completed = "Completed", // ---- Set by AU

  /** The learner attempted and succeeded in a judged activity in the AU. */
  Passed = "Passed", // ---- Set by AU

  /** The learner attempted and failed in a judged activity in the AU. */
  Failed = "Failed", // ---- Set by AU

  /** The verb "Abandoned" indicates that the AU session was abnormally 
   *    terminated by a learner's action (or due to a system failure). */
  Abandoned = "Abandoned", // ---- Set by LMS

  /** The verb "Waived" indicates that the LMS has determined that the AU 
   *    requirements were met by means other than the moveOn criteria being met. */
  Waived = "Waived", // ---- Set by LMS

  /** The verb "Terminated" indicates that the AU was terminated by the Learner 
   *    and that the AU will not be sending any more statements for the launch session. */
  Terminated = "Terminated", // ---- Set by AU

  /** The verb "Satisfied" indicates that the LMS has determined that the Learner 
   *      has met the moveOn criteria of all AU's in a block or has met the moveOn 
   *        criteria for all AU's in the course. */
  Satisfied = "Satisfied", // ---- Set by LMS
}