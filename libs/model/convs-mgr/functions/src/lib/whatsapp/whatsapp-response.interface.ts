import { RawMessageData } from "@app/model/convs-mgr/conversations/messages";
import { IObject } from "@iote/bricks";
import { WhatsAppMessagePayLoad } from "./raw-whatsapp-payload.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

// export interface WhatsAppResponse extends IObject {
//   //Phone number of business/manager of the bot displayed on chat of bot user
//   botAccountDisplayPhoneNumber:string,

//   //id of phone number of business/manager of the bot
//   botAccountphonNumberId:string,

//   //Name of the person sending the message to the bot
//   botUserName: string,

//   //Phone number of the person sending the message to the bot
//   botUserPhoneNumber:string,

//   //Actual message being sent by the user to the bot
//   message: WhatsAppMessagePayLoad

//   messageType?: WhatsAppMessageType

// }

export interface WhatsAppResponse extends RawMessageData {

  //Actual message being sent by the user to the bot
  message: WhatsAppMessagePayLoad

  // Type of message e.g. text, location, contact etc
  messageType: WhatsAppMessageType

}