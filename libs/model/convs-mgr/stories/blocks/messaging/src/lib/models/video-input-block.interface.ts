import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a message in the form of text.
 */
export interface VideoInputBlock extends StoryBlock
{
  /** Message to accompany video. */
  message?: string;

  defaultTarget?: string;
}
