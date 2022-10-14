import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { IObject } from '@iote/bricks';

/** The data contained in the raw message returned by the hook */
export interface RawMessageData extends IObject{
  // The unique message Id given by the platform
  messageId?: string;

  // id of phone number of business/manager of the bot
  botAccountphoneNumberId:string,

  // Name of the person sending the message to the bot
  botUserName: string,

  // Phone number of the person sending the message to the bot
  botUserPhoneNumber:string,

  // The Platform we are getting the message from e.g. telegram, whatsapp
  platform      : Platforms;
}