import { EndUserPosition } from "./event.interface";

export interface SurveyCursor
{
  /** The id of the survey */
  surveyId: string;

  /** The time the user started the assessment  */
  startedOn?: Date;

  /** The time the user finished the assessment */
  finishedOn?: Date;

  /** The position the user was before they started the survey. */
  savedUserPosition?: EndUserPosition;
}

/** Checks if the survey is ongoing */
export const isDoingSurvey = (survey: SurveyCursor[]) => survey && !survey[0].finishedOn;