import { IObject } from "@iote/bricks";

import { ParticipantProgressMilestone } from "./participant-progress.model";
import { CompletionRateProgress } from "./completion-rate.model";

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
  todaysEnrolledUsersCount: EnrolledUserCount;

  /** progress completion rate */
  progressCompletion: CompletionRateProgress;
}

/** An object where each key represents a group name and the value is an array of participant objects belonging to that group. */
export interface GroupedParticipants { 
  [key: string]: ParticipantProgressMilestone[];
}

export interface GroupedProgressMilestone {
  /** Name of course the user has reached */
  id: string;

  /** Milestones for users in that class */
  classrooms: ClassroomProgressMilestone[];
}

/** Course visualisation  */
export interface ClassroomProgressMilestone {
  /** Name of group / class the user has reached */
  id: string;

  /** Milestones for users in that class */
  measurements: UsersProgressMilestone[];
}

export interface UsersProgressMilestone {
  /** Name of Milestone the user has reached */
  id: string;

  /** Users */
  participants: ParticipantProgressMilestone[];
}

export interface EnrolledUserCount {
  /** daily user count */
  dailyCount: number;

  /** weekly user count */
  pastWeekCount: number;

  /** monthly user count */
  pastMonthCount: number;
}
