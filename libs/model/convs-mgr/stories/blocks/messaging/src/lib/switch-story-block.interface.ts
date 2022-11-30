import { ChatMilestones } from "@app/model/convs-mgr/conversations/chats";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which links the current story to the next one
 */
export interface SwitchStoryBlock extends StoryBlock
{
  /** Id of the story to switch to */
  storyId: string;

  milestone?: ChatMilestones;
}
