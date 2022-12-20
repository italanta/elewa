import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which links the current story to the next one
 */
export interface JumpBlock extends StoryBlock
{
  /** Id of the story to switch to */
  storyId?: string;

  /** Id of the block to jump to */
  blockId?: string;
}
