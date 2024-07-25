/** 
 * Provides the criteria that should be met by the learner upon 
 *    finishing the micro-app.
 */
export enum AssessmentStatusTypes
{
  /**Percentage set to mark a task as done */
  Completed = 'completed',
  /** A task is done, and test scores meet the pass criteria  */
  Incomplete = 'incomplete',
  /** Test scores meet the pass criteria */
  Passed = 'passed',
  /** Test scores do not meet the pass criteria */
  Failed = 'failed',
}
