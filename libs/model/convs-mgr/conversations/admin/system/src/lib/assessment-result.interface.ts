/**
 * Here, we store the results of a completed assessment for a specific
 *   end user.
 */
export interface AssessmentResult 
{
  /** The id of the assessment */
  assessmentId: string;

  /** Percentage score of the assessment */
  percentage: number;

  /** Sum of all the marks accumulated in the assessment */
  totalScore: number;

  /** The time the user started the assessment  */
  startedOn?: Date;

  /** The time the user finished the assessment */
  finishedOn?: Date;
}