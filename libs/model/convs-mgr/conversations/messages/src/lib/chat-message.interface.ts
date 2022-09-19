import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { MessageTypes }   from './message-types.enum';
import { MessageOrigins } from './message-origins.enum';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';

export interface ChatMessage extends IObject
{
  date: Timestamp | Date;

  type: MessageTypes;
  origin: MessageOrigins;

  /** In case we don't have a default case for the past button, pass everything in the data object. */
  _raw: any;
}

export interface TextMessage extends ChatMessage
{
  message: string;

  type: MessageTypes.Text;
}

export interface ButtonMessage extends ChatMessage
{
  options: string[];

  type: MessageTypes.Buttons;
}

export interface ResourceMessage extends ChatMessage
{
  url: string;

  type: MessageTypes.Resource | MessageTypes.Image;
}
  export interface ImageMessage extends ResourceMessage
  {
    type: MessageTypes.Image;
  }

  export interface Chat extends IObject{
    chatId: string;
    status: ChatStatus;
    platform: Platforms;
  
  }
  
  export enum ChatStatus {
    Running           = 0,
    Paused            = 5,
    ChatWithOperator  = 10,
    Ended             = 15
  }