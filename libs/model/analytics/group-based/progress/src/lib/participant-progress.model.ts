
/**
 * Model for analysing and visualing participant progress. 
 * 
 * Used in the participant progress barchart.
 */
export interface ParticipantProgressModel 
{
  milestones: ParticipantProgressMilestone[];
}

/** Progress of a user on a single moment in time. */
export interface ParticipantProgressMilestone
{
  /** Unix time interval at which is measured */
  time: number; 
  /** Milestone the user has reached */
  milestone: string; 
  /** Story ID of the milestone the user has reached */
  storyId: string;
}
