import { IObject } from '@iote/bricks';

import { Platforms } from './platforms.enum';

export interface Provider extends IObject {
  id        : string;
  orgId     : string;
  storyId   : string;
  platform  : Platforms;
}