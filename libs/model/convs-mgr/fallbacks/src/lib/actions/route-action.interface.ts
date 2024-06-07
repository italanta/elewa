import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { Action } from '../fallback.interface';

export interface RouteAction extends Action {
  storyId: string;
  block: StoryBlock;
}
