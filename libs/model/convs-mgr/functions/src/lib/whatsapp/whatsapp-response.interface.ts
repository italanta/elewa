import { RawMessageData } from "@app/model/convs-mgr/conversations/messages";
import { WhatsAppMessagePayLoad } from "./raw-whatsapp-payload.interface";

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
}