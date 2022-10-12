import { BaseChannel } from '@app/model/bot/channel';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';

export interface BaseMessage extends BaseChannel {

  /* The type of channel the message is received from e.g. whatsapp, telegram*/
  platform?      : Platforms;

  /* The message text sent by the end user */
  message       : any;

}