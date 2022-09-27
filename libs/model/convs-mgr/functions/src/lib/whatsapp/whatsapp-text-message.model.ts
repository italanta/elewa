import { WhatsAppBaseMessage } from "./whatsapp-base-message.model";
import { WhatsAppMessageType } from "./whatsapp-message-types.model";

/**
 * Contains only fields for type text
 * @extends {WhatsAppBaseMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#text-messages
 */
export interface WhatsAppTextMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType.TEXT,
  text :{
    //Incase message has a preview
    preview_url: boolean,
    //The message itself
    body: string
  }

}