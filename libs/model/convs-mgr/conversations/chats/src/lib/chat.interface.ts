import { ChatFlowStatus } from './chat-flow-status.enum';
import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock, QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { ChatStatus } from './end-user.interface';

/**
 * An end user which 
 */
export interface ChatUser extends IObject
{
  /** Chat ID used by LandBot and acting as general identifier. */
  id: string;

  /** Important! Stored in format 712345678 */
  phone: string;

  name: string;

  info?: ChatUserInfo;

  // channel: CommunicationChannel;
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

export interface ChatInfo {
  id: string;
  phoneNumber: string;
  orgId: string;
  storyId: string;
}

export interface Connection extends IObject {
  slot: number;
  sourceId: string;
  targetId: string;
}


export interface DefaultBlock extends StoryBlock {
  nextBlock: string;
}

export type Block = TextMessageBlock | QuestionMessageBlock;
