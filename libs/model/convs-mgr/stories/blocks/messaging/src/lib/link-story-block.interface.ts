import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which links the current story to the next one
 */
export interface LinkStoryBlock extends StoryBlock
{
  /** Id of the story to switch to */
  storyId?: string;

}
