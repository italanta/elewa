import { WhatsAppBaseMessage } from "./whatsapp-base-message.model";
import { WhatsAppMessageType } from "./whatsapp-message-types.model";

/**
 * Contains only fields for type image
 * @extends {WhatsAppBaseMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-messages
 */
export interface WhatsAppMediaMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType.IMAGE,
  image: {
    link: string;
  }

}