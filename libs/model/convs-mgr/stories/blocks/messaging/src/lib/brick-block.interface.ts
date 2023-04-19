import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

/* Block that allows users to navigate to different routes in the conversation flow. */

export interface BrickBlock extends StoryBlock {
  /**Text that is expected as input */
  message?: string;

  defaultTarget?: string;
}
