import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { Button } from "./question-message-block.interface";
/**
 * Block which links the current story to the next one
 */
export interface JumpBlock extends StoryBlock
{
  /** Id of the story to switch to */
  targetStoryId?: string;

  /** Id of the block to jump to */
  targetBlockId?: string;

  options?: ButtonsBlockButton<Button>[];
}
