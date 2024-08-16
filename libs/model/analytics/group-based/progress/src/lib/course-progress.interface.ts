import { UserCount } from "./user-count.interface";

/**
 * Tracks the engagement of the course over time
 */
export interface CourseProgress {
  /** Users actively engaging with the course */
  activeUsers: UserCount;
  inactiveUsers: UserCount;

  /** All the users enrolled in this course */
  totalUsers?: UserCount;

  /** Number of learners who have completed the course */
  completedLearnerCount?: number;

  /** Total time in seconds all learners have taken to complete the course  */
  totalCompletionDuration?: number;

  /** Id's of the users enrolled in this course */
  enrolledUsers?: {phoneNumber: string, id: string}[];
}

