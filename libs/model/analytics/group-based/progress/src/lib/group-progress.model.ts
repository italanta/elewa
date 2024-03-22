import { IObject } from "@iote/bricks";

import { CompletedCourse } from "@app/model/convs-mgr/learners";

import { ParticipantProgressMilestone } from "./participant-progress.model";
import { CompletionRateProgress } from "./completion-rate.model";
import { CourseProgress } from "./course-progress.interface";
import { UserCount } from "./user-count.interface";

/**
 * Model for analysing and visualing grouping progress data. 
 * 
 * Used in the group-based-progress hierarchical barchart.
 */
export interface GroupProgressModel extends IObject 
{
  /** time in unix */
  time: number;

  /** All users milestones */
  measurements: UsersProgressMilestone[];

  /** Grouped milestones by class/group */
  groupedMeasurements: GroupedProgressMilestone[];

  /** Today's EnrolledUserCount */
  todaysEnrolledUsersCount: UserCount;

  /** progress completion rate */
  progressCompletion: CompletionRateProgress;

  courseProgress: {[key:string]: CourseProgress};

  /** Courses Completed */
  coursesCompleted: CompletedCourse[];

  /** Courses started */
  coursesStarted: CompletedCourse[];
}

/** An object where each key represents a group name and the value is an array of participant objects belonging to that group. */
export interface GroupedParticipants
{
  [key: string]: ParticipantProgressMilestone[];
}

export interface GroupedProgressMilestone
{
  /** Name of course the user has reached */
  id: string;

  /** Milestones for users in that class */
  classrooms: ClassroomProgressMilestone[];
}

/** Course visualisation  */
export interface ClassroomProgressMilestone
{
  /** Name of group / class the user has reached */
  id: string;

  /** Milestones for users in that class */
  measurements: UsersProgressMilestone[];
}

export interface UsersProgressMilestone
{
  /** Name of Milestone the user has reached */
  id: string;

  /** Users */
  participants: ParticipantProgressMilestone[];
}