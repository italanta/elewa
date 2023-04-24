
/**
 * Model for analysing and visualing participant progress. 
 * 
 * Used in the participant progress barchart.
 */

export interface ParticipantProgressMilestone
{
  participant: { id:string, name:string, phone:string };
  /** Unix time interval at which is measured */
  group: string; 
  /** Milestone the user has reached */
  milestone: string; 
  /** Story ID of the milestone the user has reached */
  storyId: string;
}
