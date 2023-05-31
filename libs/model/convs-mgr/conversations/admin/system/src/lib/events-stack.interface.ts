/**
 * Represents a tracking mechanism for user progress in a course
 * we use it to track when our users reach certain parts of the course or achieve certain objectives.
 * @interface
 */
export interface EventsStack {
  /** The unique identifier for the events stack.*/
  uid: string;
  
  /** The name of the events stack.*/
  name: string;
  
  /** Indicates whether the events stack represents a milestone or achievement.*/
  isMilestone: boolean;
  
  /** The payload associated with the events stack, capturing user-specific data or information.*/
  payload: any;
}
