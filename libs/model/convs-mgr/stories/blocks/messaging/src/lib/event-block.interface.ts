import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which is used to track when a user reaches a certain action
 */
export interface EventBlock extends StoryBlock
{
  /** Takes in name of the event. */
  eventName?: string;

  defaultTarget?: string;

  /** Optional field to store message to be sent out */
  payLoad?: string;

  /** Marks if event block signifies a milestone */
  isMilestone?: boolean;
}