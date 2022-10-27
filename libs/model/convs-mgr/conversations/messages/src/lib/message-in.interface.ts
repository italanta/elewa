import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { IObject } from '@iote/bricks';

import { MessageTypes } from './message-types.enum';

/** 
 * An incoming message that is sent by an @see {EndUser} through a specific @see {Platform}.
 */
export interface IncomingMessage extends IObject
{
  /* The unique message Id given by the platform from which this message was sent. */
  id?: string;

  /** Id of phone number of business/manager of the bot */
  platformId:string,

  /** Name of the end user communicating the bot */
  endUserName: string,

  /** Phone number of the end user communicating with the bot */
  endUserNumber:string,

  /** Type of message received from the end user e.g. text, image, etc */
  type : MessageTypes;

  /** The Platform we are getting the message from e.g. telegram, whatsapp */
  platform : PlatformType;
}
