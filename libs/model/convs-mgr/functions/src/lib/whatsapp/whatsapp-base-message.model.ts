import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { IObject } from "@iote/bricks";
import { WhatsAppMessageType } from "./whatsapp-message-types.model";

//All the fields that are required for all types of whatsapp messages
//see : https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#send-messages

export interface WhatsAppBaseMessage extends BaseMessage{
  messaging_product: MetaMessagingProducts,
  recepient_type: RecepientType,
  to: string,
  type: WhatsAppMessageType
}


export enum MetaMessagingProducts {
  WHATSAPP = "whatsapp",
  MESSENGER = "messenger",
  INSTAGRAM = "instagram"
}

export enum RecepientType{
  INDIVIDUAL = "individual",
  GROUP = "group"
}