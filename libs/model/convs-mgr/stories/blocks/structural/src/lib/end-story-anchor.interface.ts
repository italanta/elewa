import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { StoryModuleResult } from "./story-module-block.interface";

/**
 * End of story anchor
 */
export interface EndStoryAnchorBlock extends StoryBlock
{
  /** Additional outputs of the story (past the main one) */
  outputs: StoryModuleResult[]
}
