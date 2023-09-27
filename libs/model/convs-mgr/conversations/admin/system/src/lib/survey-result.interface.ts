/**
 * Here, we store the results of a completed survey for a specific
 *   end user.
 */
export interface SurveyResult 
{
  /** The id of the survey */
  surveyId: string;

  /** The time the user started the survey  */
  startedOn?: Date;

  /** The time the user finished the survey */
  finishedOn?: Date;
}