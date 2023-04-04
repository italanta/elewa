import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a message in the form of text.
 */
export interface ImageInputBlock extends StoryBlock
{
  /** Message to accompany image. */
  message?: string;

  defaultTarget?: string;
}
