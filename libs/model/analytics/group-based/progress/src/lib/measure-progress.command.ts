/**
 * Command to measure progress of a participant.
 */
export interface MeasureProgressCommand 
{
  /** Organisation of the participant to measure. */
  orgId: string;

  /** ID of participant of which we want to measure progress. */
  participantId: string;

  /** Collection of unix timestamps at which time to measure. */
  interval: number[];

  /** @optional - Group stories by a certain label index */
  // TODO: @Reagan - Labels in the future need to be key-value pair? Now we put the index of key to look at which is buggy at best.
  storyGroupIdentifier?: number;
}
