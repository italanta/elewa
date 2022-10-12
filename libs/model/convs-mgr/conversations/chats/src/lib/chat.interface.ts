import { ChatFlowStatus } from './chat-flow-status.enum';
import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { ChatStatus } from './chat-status.enum';
import { CommunicationChannelTypes } from '@elewa/model/admin/system';

export interface Chat extends IObject
{
  /** Chat ID used by LandBot and acting as general identifier. */
  id: string;

  /** Important! Stored in format 712345678 */
  phone: string;

  name: string;

  info?: ChatUserInfo;

  channel: CommunicationChannelTypes;
  channelId: string;
  channelName: string;

  status: ChatStatus;

  flow?: ChatFlowStatus;
  pause?: {
    // chatRef: string;
    blockRef: string;
  }

  stashed?: {
    reason: string;
    stashedBy: string;
  }

  error?: {
    code: string;
    message: string;
  }

  awaitingResponse?: boolean;

  onboardedOn?: Timestamp | Date;

  instructors?: string[];

  lastMsg?: any;
}

export interface ChatUserInfo {
  age: number;
  county: string;

  scoutBefore: boolean;
}
