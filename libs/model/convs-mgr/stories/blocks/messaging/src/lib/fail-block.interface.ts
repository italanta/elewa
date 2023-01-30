import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which is used to mark that a conversational flow has failed
 */
export interface FailBlock extends StoryBlock
{
  /** Message to accompany image. */
  message?: string;

  defaultTarget?: string;
}
