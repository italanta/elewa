import
{
  MetaMessagingProducts,
  RecepientType,
  WhatsAppMessageType,
  WhatsAppTemplateMessage,
  WhatsappSendBodyTemplateComponent,
  WhatsappSendHeaderTemplateComponent,
  WhatsappSendImageTemplateParameter,
  WhatsappSendTemplateParameter,
} from '@app/model/convs-mgr/functions';

import { ImageTemplateMessage, OutgoingMessagePayload,TemplateMessage, TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';

/**
 * Interprets our standardized template messages @see {Message} to a whatsapp template message.
 * 
 * @param {Message}- The standardized message format to be converted to whatsapp template message
 * @param {phone}- The phone number of the end user
 * 
 * Whatsapp message templates are of different types, that's why we need to create a separate class that
 *  only focus on the template messages. This avoids bloating the main outgoing parser and creates a base to 
 *    implement the other types of message templates.
 * 
 * The below is the full list
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates
 */
export class WhatsappTemplateMessageParser
{

  /**
   * @Description Used to send template message
   */
  private _getTextTemplateMessage(message: TemplateMessage, phone: string): any
  {
    // Create the text payload which will be sent to api
    const generatedMessage: WhatsAppTemplateMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      
      type: WhatsAppMessageType.TEMPLATE,
      template: {
        name: message.name,
        language: {
          code: message.language
        }
      }
    };

    // If the message has parameters which can be variables, then we include them
    //  in the whatsapp message
    if(message.params) {
      const templateParams: WhatsappSendTemplateParameter[] = message.params.map((param) =>
      {
        return {
          type: WhatsAppMessageType.TEXT,
          text: param.value,
        };
      });

      const templateComponents = [
        {
          type: "body",
          parameters: templateParams,
        }
      ] as WhatsappSendBodyTemplateComponent[];

      generatedMessage.template.components = templateComponents;
    }

    return generatedMessage;
  }

  private _getImageTemplateMessage(message: ImageTemplateMessage, phone: string): any
  {
    // Create the text payload which will be sent to api
    const generatedMessage: WhatsAppTemplateMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      
      type: WhatsAppMessageType.TEMPLATE,
      template: {
        name: message.name,
        language: {
          code: message.language
        }
      }
    };

    // If the message has parameters which can be variables, then we include them
    //  in the whatsapp message
    if(message.params) {
      const templateParams: WhatsappSendTemplateParameter[] = message.params.map((param) =>
      {
        return {
          type: WhatsAppMessageType.TEXT,
          text: param.value,
        };
      });

      const templateComponents = [
        {
          type: "body",
          parameters: templateParams,
        }
      ] as WhatsappSendBodyTemplateComponent[];

      generatedMessage.template.components = templateComponents;
    }

    const headerComponent = {
      type: 'header',
      parameters: [
        {
          type: 'image',
          image: {
            link: message.url
          } 
        } as WhatsappSendImageTemplateParameter
      ]
    } as WhatsappSendHeaderTemplateComponent;

    if(generatedMessage.template.components && generatedMessage.template.components.length > 0) {
      generatedMessage.template.components.unshift(headerComponent)

    } else {
      generatedMessage.template.components = [headerComponent];
    }

    return generatedMessage;
  }

  /** Gets the appropriate template based on the templateType - @TemplateMessageTypes */
  parse(message: TemplateMessage, phone: string): OutgoingMessagePayload
  {
    let parser!: (message: TemplateMessage, phone: string) => OutgoingMessagePayload;

    switch (message.templateType) {
      case TemplateMessageTypes.Text:                parser = this._getTextTemplateMessage; break;
      case TemplateMessageTypes.Image:               parser = this._getImageTemplateMessage; break;
      default:
        parser = this._getTextTemplateMessage;
    }

    return parser(message, phone);
  }
}
