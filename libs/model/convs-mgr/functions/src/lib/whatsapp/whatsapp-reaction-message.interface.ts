import { WhatsAppBaseMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type reaction
 * @extends {WhatsAppBaseMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#reaction-messages
 */
export interface WhatsAppReactionMessage extends WhatsAppBaseMessage{
  type: WhatsAppMessageType.REACTION,
  reaction: {
    //Id of the message a user is reacting to
    message_id: string;
    //Referes to string representation of the reaction emoji
    emoji: string;
  }
}