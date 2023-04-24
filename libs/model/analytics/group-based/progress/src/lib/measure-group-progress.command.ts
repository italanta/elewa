/**
 * Command to measure progress of a group of participants.
 */
export interface MeasureGroupProgressCommand 
{
  /** Organisation of the participant to measure. */
  orgId: string;

  /** Collection of unix timestamps at which time to measure progress. */
  interval?: number[];
}
