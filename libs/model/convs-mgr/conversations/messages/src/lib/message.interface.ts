import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { IObject } from '@iote/bricks';

export interface BaseMessage extends IObject {
  /* The channel the message is linked to. We get this by matching the business no. to the registered channel collection*/
  channelId?     : string;

  /* The id of the organization/user who created the bot */
  orgId?         : string;

  /* The story the bot is currently working on */
  storyId?       : string;

  /* The phone number of the end user chatting with the bot */
  phoneNumber?   : string;

  /* The type of channel the message is received from e.g. whatsapp, telegram*/
  platform?      : Platforms;

  /* The message text sent by the end user */
  message       : string;
}