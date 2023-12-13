import { Classroom } from "@app/model/convs-mgr/classroom";
// import { EnrolledUserProgress } from "..";

/**
 * Model representing an individual participant and their current progress (storyID reached at set calculation time).
 * 
 * Used in the participant progress barchart.
 */
export interface ParticipantProgressMilestone
{
  /** Individual participant/user */
  participant: { id:string, name:string, phone:string, progress: EnrolledUserProgress[] };

  /** group/class the user is part of */
  classroom: Classroom; 

  /** Milestone the user has reached */
  milestoneId: string; 
  
  /** Course that the user is in */
  courseId: string;

  /** Story ID of the milestone the user has reached */
  storyId: string;
}

/** user progress per course */
export interface EnrolledUserProgress {
  courseId: string;
  courseProgress: number;
  modules: ModuleProgress[];
}

/** user progress per module */
export interface ModuleProgress {
  moduleId: string;
  moduleProgress: number;
  lessons: LessonProgress[];
}

/** user progress per lesson */
export interface LessonProgress {
  lessonId: string;
  progress: number;
}
