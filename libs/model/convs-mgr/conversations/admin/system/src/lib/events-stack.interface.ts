/**
 * Represents a tracking mechanism for user progress in a course
 * we use it to track when our users reach certain parts of the course or achieve certain objectives.
 * @interface
 */
export interface EventsStack {
  /** The unique identifier for the event */
  uid: string;
  
  /** The name of the event.*/
  name: string;
  
  /** Indicates whether the event represents a milestone or achievement.*/
  isMilestone: boolean;
  
  /** The payload associated with the event, capturing user-specific data or information.*/
  payload: any;
}
