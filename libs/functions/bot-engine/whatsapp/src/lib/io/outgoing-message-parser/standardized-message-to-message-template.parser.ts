import
{
  MetaMessagingProducts,
  RecepientType,
  WhatsAppMessageType,
  WhatsAppTemplateMessage,
  WhatsappSendHeaderTemplateComponent,
  WhatsappSendImageTemplateParameter,
} from '@app/model/convs-mgr/functions';

import { ImageTemplateMessage, OutgoingMessagePayload, TemplateMessage, TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
import { MapParamsToGeneratedMessage } from '../../utils/map-params-to-generated-message.util';

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

    return generatedMessage;
  }

  private _getImageTemplateMessage(message: TemplateMessage, phone: string): any
  {
    const imageTemplateMessage = message as ImageTemplateMessage;
    // Create the text payload which will be sent to api
    const generatedMessage: WhatsAppTemplateMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,

      type: WhatsAppMessageType.TEMPLATE,
      template: {
        name: imageTemplateMessage.name,
        language: {
          code: imageTemplateMessage.language
        }
      }
    };
    
    const headerComponent = {
      type: 'header',
      parameters: [
        {
          type: 'image',
          image: {
            link: imageTemplateMessage.url
          }
        } as WhatsappSendImageTemplateParameter
      ]
    } as WhatsappSendHeaderTemplateComponent;

    if (generatedMessage.template.components && generatedMessage.template.components.length > 0) {
      generatedMessage.template.components.unshift(headerComponent);

    } else {
      generatedMessage.template.components = [headerComponent];
    }

    return generatedMessage;
  }

  /** Gets the appropriate template based on the templateType - @TemplateMessageTypes */
  parse(message: TemplateMessage, phone: string): OutgoingMessagePayload
  {
    let outgoingMessage: OutgoingMessagePayload;

    switch (message.templateType) {
      case TemplateMessageTypes.Text: outgoingMessage = this._getTextTemplateMessage(message, phone); break;
      case TemplateMessageTypes.Image: outgoingMessage = this._getImageTemplateMessage(message, phone); break;
      default:
        outgoingMessage = this._getTextTemplateMessage(message, phone);
    }

    // If the message has parameters which can be variables, then we include them
    //  in the whatsapp message
    if (message.params?.length) {
      // Map message parameters to WhatsApp template components
      const templateComponents = MapParamsToGeneratedMessage(message);
    
      // If template components were successfully created
      if (templateComponents.length > 0) {
        // Ensure that 'outgoingMessage' has a 'template.components' array
        const outgoingTemplate = (outgoingMessage as any).template;
        
        if (outgoingTemplate.components?.length > 0) {
          // Append new components to the existing array
          outgoingTemplate.components.push(...templateComponents);
        } else {
          // Initialize the components array with the new template components
          outgoingTemplate.components = templateComponents;
        }

        (outgoingMessage as any).template.components = outgoingTemplate.components;
      }
    }

    return outgoingMessage;
  }
}
