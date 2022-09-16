import { IObject } from '@iote/bricks';
import { MessageTypes } from './message-types.enum';
import { MessageOrigins } from './message-origins.enum';

import { CommunicationChannelTypes } from '@app/model/convs-mgr/conversations/admin/system';

export interface RawMessageWrapper
{
  messages: RawMessage[];
}

export interface RawMessage extends IObject
{
  _raw : {
    /** ChatID */
    chat: string;
  }

  channel: {
    id: number;
    name: string;
    type: CommunicationChannelTypes;
  }

  data: {
    body?: string;
    buttons?: string[];
    url?: string;
  }

  /** Customer information - Data fields set on level of chat. */
  customer: any;

  /** Sender information */
  sender: {
    /** Warning - Can be multiple senders within one chat. This is the id of the sender, not of the chat! */
    id: number,
    name: string,
    type: MessageOrigins;
  }

  /** Recorded in unix epoch time -> *1000 needed to run properly. */
  timestamp: number;
  type: MessageTypes;
}
