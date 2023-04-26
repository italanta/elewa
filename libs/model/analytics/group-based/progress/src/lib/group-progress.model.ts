import { IObject } from "@iote/bricks";
import { ParticipantProgressMilestone } from "./participant-progress.model";

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
}

export interface GroupedParticipants { 
  [key: string]: ParticipantProgressMilestone[];
}

/** Progress of a group at a single moment in time. */
export interface UsersProgressMilestone
{
  /** Name of Milestone the user has reached */
  name: string; 

  /** Users */
  participants: ParticipantProgressMilestone[];
}

export interface GroupedProgressMilestone
{
  /** Name of group / class */
  name: string; 

  /** milestones for users in  that class*/
  measurements: UsersProgressMilestone[];
}
