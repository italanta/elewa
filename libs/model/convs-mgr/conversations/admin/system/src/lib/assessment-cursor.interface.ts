
/**
 * When an end user is navigating through a @see Story and hits a jump block, we
 *  go into a child story. And when the child story completes we will need to know
 *   if it was successful or it failed so that we can continue the flow of the parent story
 *    appropriately.   
 * 
 * We store this information in @type {RoutedCursor}
 */ 
export interface AssessmentCursor 
{
  /** The id of the assessment */
  assessmentId: string;

  /** Maximum score of the assessment */
  maxScore: number;

  /** The time the user started the assessment  */
  startedOn?: Date;

  /** The score the learner has in the assessment */
  score: number;
  
  /** The id of the block to navigate to if the learner fails the assessment
   */
  fail?: string;

  /** The id of the block to navigate to if the learner performs average in the assessment
   */
  average?: string;

  /** The id of the block to navigate to if the learner passes the assessment 
   */
  pass?: string;
}