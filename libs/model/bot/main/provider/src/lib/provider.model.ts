import { IObject } from '@iote/bricks';

import { PlatformType } from './PlatformType.enum';

export interface Provider extends IObject {
  id        : string;
  orgId     : string;
  storyId   : string;
  platform  : PlatformType;
}