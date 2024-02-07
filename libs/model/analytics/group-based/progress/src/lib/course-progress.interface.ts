import { UserCount } from "./user-count.interface";

/**
 * Tracks the engagement of the course over time
 */
export interface CourseProgress {
  activeUsers: UserCount;
  inactiveUsers: UserCount;
  totalUsers: UserCount;
}

