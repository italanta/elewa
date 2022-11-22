import { OutgoingMessagePayload } from "@app/model/convs-mgr/conversations/messages";

import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

//All the fields that are required for all types of whatsapp messages
//see : https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#send-messages

export interface WhatsAppOutgoingMessage extends OutgoingMessagePayload{
  messaging_product: MetaMessagingProducts,
  context?: { message_id: string },
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