import { IObject } from '@iote/bricks';

import { CommunicationChannelTypes } from './communication-channel-types.enum';
import { SupportedCommunicationConnectors } from './supported-communication-connectors.enum';

export interface CommunicationChannel extends IObject
{
  /** ChannelId of Landbot (in case of landbot integration) */
  id?: string;
  name: string;
  type: CommunicationChannelTypes;
  /** Technical ref that will be passed with returning messages from the bot */
  ref: string;
  connector: SupportedCommunicationConnectors;
}

