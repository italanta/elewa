import { BaseChannel } from '@app/model/bot/channel';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';

/** Basic message structure that will be the same when interpreted from any platform 
 * TODO: Refactor - remove extension of base channel, and update all functions
*/
export interface BaseMessage extends BaseChannel {

  /* The platform the message is received from e.g. whatsapp, telegram*/
  platform?      : Platforms;

  /* The message details sent by the end user 
   * Type 'any' because message stucture can be different across platforms e.g. a whatsapp text message may have a different structure with a telegram text message
   * To later create a base message that normalizes the different types of messages.
   */
  message?       : any;

  /** The end user phone number we have received the message from */
  phoneNumber?   : string;

}