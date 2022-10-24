import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { IObject } from '@iote/bricks';
import { MessageTypes } from "@app/model/convs-mgr/functions";

/** The data contained in the raw message returned by the hook */
export interface RawMessageData extends IObject{
  // The unique message Id given by the platform
  messageId?: string;

  // id of phone number of business/manager of the bot
  botAccountId:string,

  // id of phone number of business/manager of the bot
  botAccountphoneNumberId:string,

  // Name of the end user communicating the bot
  botUserName: string,

  // Phone number of the end user communicating with the bot
  botUserPhoneNumber:string,

  // Type of message received from the end user e.g. text, image, etc
  messageType: MessageTypes;

  // The Platform we are getting the message from e.g. telegram, whatsapp
  platform      : Platforms;
}