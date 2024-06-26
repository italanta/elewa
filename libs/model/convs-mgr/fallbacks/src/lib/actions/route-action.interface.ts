import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { Action } from '../fallback.interface';

export interface RouteAction extends Action {
  moduleId: string;
  
  storyId: string;
  /** Full block object is stored to save time retrieving the block  */
  block: StoryBlock;
  blockId: string;
}
