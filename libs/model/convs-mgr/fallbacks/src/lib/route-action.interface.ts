import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { Action } from './fallbackui.model';

export interface RouteAction extends Action {
  storyId: string;
  block: StoryBlock;
}
