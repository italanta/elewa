/**  At what state is a Micro app in */
export enum MicroAppStatusTypes
{
  /** user has clicked the micro-app link */
  Launched = "launched",
  /** A user has started consuming the course content, by clicking the start button */
  Started = "started",
  /** A learner has finished with all of the content */
  Completed = "completed",
  /** A user started interacting with the content and left it unfinished */
  Abandoned = "abandoned",
  /** If the micro-app progress has been forcefully marked as completed by the content creator */
  Waived = "waived",
  /** If the micro-app progress has been brought to an end */
  Terminated = "terminated"
}