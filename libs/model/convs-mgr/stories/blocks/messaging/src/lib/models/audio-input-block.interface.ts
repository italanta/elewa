import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which inquires an audio from the user.
 */
export interface AudioInputBlock extends StoryBlock
{
  /** Message to accompany image. */
  message?: string;

  defaultTarget?: string;
}
