import { WhatsAppOutgoingMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type text
 * @extends {WhatsAppMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#text-messages
 */
export interface WhatsAppTemplateMessage extends WhatsAppOutgoingMessage
{
  type: WhatsAppMessageType.TEMPLATE,
  template: {
    name: string,
    language: {
      code: string;
    },
    components: WhatsappTemplateComponent[];
  };

}

export interface WhatsappTemplateComponent {
  type: "body";
  parameters: WhatsappTemplateParameter[];
}

export interface WhatsappTemplateParameter { 
  type: WhatsAppMessageType;
  text: string;
}