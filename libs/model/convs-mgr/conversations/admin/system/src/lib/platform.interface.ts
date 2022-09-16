import { IObject } from '@iote/bricks';

import { Platforms } from './platform-types.enum';

export interface CommunicationChannel extends IObject
{
  /** ChannelId of Landbot (in case of landbot integration) */
  id?: string;
  name: string;
  type: Platforms;
  /** Technical ref that will be passed with returning messages from the bot */
  ref: string;
}

