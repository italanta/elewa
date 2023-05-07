import { EndUser } from "@app/model/convs-mgr/conversations/chats";

/**
 * Command to measure progress of a participant.
 */
export interface MeasureProgressCommand 
{
  /** Organisation of the participant to measure. */
  orgId: string;

  /** Participant/Enduser of whom we want to measure their progress. */
  participant: EndUser;

  /** Collection of unix timestamps at which time to measure. */
  interval?: number;
}
