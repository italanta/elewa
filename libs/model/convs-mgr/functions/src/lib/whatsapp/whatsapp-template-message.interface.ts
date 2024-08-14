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
    components?: WhatsappTemplateComponent[];
  };

}
export interface WhatsappTemplateComponent {
  parameters: WhatsappSendTemplateParameter[];
}

export interface WhatsappSendBodyTemplateComponent extends WhatsappTemplateComponent {
  type: "body";
  parameters: WhatsappSendTemplateParameter[];
}


export interface WhatsappSendHeaderTemplateComponent extends WhatsappTemplateComponent {
  type: "header";
  parameters: WhatsappSendTemplateParameter[];
}
export interface WhatsappSendTemplateParameter { 
  type: WhatsAppMessageType;
}

export interface WhatsappSendTextTemplateParameter extends WhatsappSendTemplateParameter { 
  text: string;
}


export interface WhatsappSendImageTemplateParameter extends WhatsappSendTemplateParameter { 
  image: {
    link: string;
  };
}