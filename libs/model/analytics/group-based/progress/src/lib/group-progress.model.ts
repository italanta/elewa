import { ParticipantProgressMilestone } from "./participant-progress.model";

/**
 * Model for analysing and visualing grouping progress data. 
 * 
 * Used in the group-based-progress hierarchical barchart.
 */
export interface GroupProgressModel 
{
  /** All users milestones */
  measurements: GroupProgressMilestone[];

  /** Grouped milestones by class/group */
  groupedMeasurements: GroupProgressMilestone[];
}

export interface GroupedParticipants { 
  [key: string]: ParticipantProgressMilestone[];
}

/** Progress of a group at a single moment in time. */
export interface GroupProgressMilestone
{
  /** Name of Milestone the user has reached */
  name: string; 
  /** Users */
  participants: ParticipantProgressMilestone[];
}
