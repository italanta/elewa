import { IObject } from "@iote/bricks";

import { AUStatus } from "./au-status.interface";

/**
 * A course is a structured and organized set of learning activities that 
 *    are designed to achieve a specific learning outcome or objective.
 * 
 * A course can contain one or more Assignable Units
 * 
 * In this interface we track the learner progress from a general  
 *  point of view - course-wide
 */
export interface CourseParticipation extends IObject
{
  /** Time the learner started the course */
  startedOn: Date;
  /** Time the learner completed the course */
  completedOn?: Date;

  /** The overall progression of the learner throughout the course */
  status: CourseStatus;

  /** The status of the learner in indivial learning activities(AU) */
  activityStatus?: AUStatus[];
}

/** Progression of the learner throughout the course */
export enum CourseStatus 
{
  /** The learner is currently going on with the course */
  InProgress = "in-progress",

  /** The learner has completed all the assignable units. */
  Completed = "completed",

  /** The learner has either skipped, abandoned or terminated one or more Assignable Units */
  Unsatisfactory = "unsatisfactory"
}