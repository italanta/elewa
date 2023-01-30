import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which queries a location from the user
 */
export interface LocationInputBlock extends StoryBlock
{
  /** Message to accompany image. */
  message?: string;

  defaultTarget?: string;
}
