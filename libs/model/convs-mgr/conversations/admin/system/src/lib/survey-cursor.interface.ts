
/**
 * When an end user is navigating through a @see Story and hits a jump block, we
 *  go into a child story. And when the child story completes we will need to know
 *   if it was successful or it failed so that we can continue the flow of the parent story
 *    appropriately.   
 * 
 * We store this information in @type {RoutedCursor}
 */ 
export interface SurveyCursor 
{
  /** The id of the survey */
  surveyId: string;

  /** The time the user started the survey  */
  startedOn?: Date;

  /** The time the user finished the survey */
  finishedOn?: Date;

}