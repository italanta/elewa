import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { MessageTypes }   from './message-types.enum';
import { MessageOrigins } from './message-origins.enum';

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
