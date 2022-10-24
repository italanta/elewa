import { WhatsAppBaseMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type image
 * @extends {WhatsAppBaseMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-messages
 */
export interface WhatsAppMediaMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType,
  image: {
    link: string;
  }

}