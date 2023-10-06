import { Classroom } from "@app/model/convs-mgr/classroom";

/**
 * Model representing an individual participant and their current progress (storyID reached at set calculation time).
 * 
 * Used in the participant progress barchart.
 */
export interface ParticipantProgressMilestone
{ 
  /** Individual participant/user */
  participant: { id:string, name:string, phone:string };

  /** group/class the user is part of */
  classroom: Classroom; 

  /** Milestone the user has reached */
  milestone: string; 
  
  /** Course that the user is in */
  course: string;

  /** Story ID of the milestone the user has reached */
  storyId: string;
}
