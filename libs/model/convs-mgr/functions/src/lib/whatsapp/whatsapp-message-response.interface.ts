import { MetaMessagingProducts } from "./whatsapp-base-message.interface";

// Interface for response from whatsapp api
//reference: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages

export interface WhatsAppMessageResponse {
  messagingProduct : MetaMessagingProducts.WHATSAPP,
  contacts: {
    //Phone number of sender
    input: string;
    //Id of whatsapp user
    wa_id: string;
  }[],
  // ids of messages received
  messages: {id:string}[]
}