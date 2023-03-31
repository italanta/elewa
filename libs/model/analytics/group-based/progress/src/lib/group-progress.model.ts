import { EndUser } from '@app/model/convs-mgr/conversations/chats';

/**
 * Model for analysing and visualing grouping progress data. 
 * 
 * Used in the group-based-progress hierarchical barchart.
 */
export interface GroupProgressModel 
{
  measurements: GroupProgressMeasurement[];
}

/** Progress of a group at a single moment in time. */
export interface GroupProgressMeasurement
{
  /** Unix time interval at which is measured */
  time: number; 
  milestones: GroupProgressMilestone[];
}

export interface GroupProgressMilestone
{
  /** Milestone the user has reached */
  milestone: string; 
  /** First encountered Story ID of the milestone the group has reached */
  storyId: string;
  /** Users */
  participants: { id: string, name: string, phone: string }[];
  /** Number of users */
  nParticipants: number;
}
