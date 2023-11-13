import { Classroom } from "@app/model/convs-mgr/classroom";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

/**
 * Command to measure progress of a participant.
 */
export interface MeasureProgressCommand 
{
  /** Organisation of the participant to measure. */
  orgId: string;

  /** Participant of whom we want to measure their progress. */
  participant: Participant

  /** Collection of unix timestamps at which time to measure. */
  interval?: number;
}

export interface Participant 
{
  /** endUser */
  endUser: EndUser

  /** participant's classroom */
  classroom: Classroom
}
