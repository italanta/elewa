import { StoryBlock } from "@italanta-apps/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a message in the form of text.
 */
export interface TextMessageBlock extends StoryBlock
{
  /** Message to accompany image. */
  message?: string;
  /** Source of image to display. */
  imgSrc: string;
}
