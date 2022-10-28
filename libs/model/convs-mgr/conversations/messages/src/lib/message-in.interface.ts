import { IObject } from '@iote/bricks';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { MessageTypes } from '@app/model/convs-mgr/functions';

import { IncomingMessagePayload } from './payload-in.interface';

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

  /** Channel through which the message came in. */
  channel: CommunicationChannel;

  /** 
   * The raw message as it's coming from the third-party platform. 
   * Stored for later reference. TODO: Type as PlatformMessage which can be extended 
   *    and typed by the individual platforms.
   */
  payload: IncomingMessagePayload;
}
