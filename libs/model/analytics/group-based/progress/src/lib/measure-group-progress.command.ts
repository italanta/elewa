/**
 * Command to measure progress of a group of participants.
 */
export interface MeasureGroupProgressCommand 
{
  /** Organisation of the participant to measure. */
  orgId: string;

  /** EndUser label to focus on */
  label: string;

  /** Collection of unix timestamps at which time to measure progress. */
  interval: number[];

  /** @optional - Group participants by a certain label key */
  participantGroupIdentifier?: string;

  /** @optional - Group stories by a certain label key */
  storyGroupIdentifier?: string;
}
