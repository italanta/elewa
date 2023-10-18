import
{
  MetaMessagingProducts,
  RecepientType,
  WhatsAppMessageType,
  WhatsAppTemplateMessage,
  WhatsappTemplateComponent,
  WhatsappTemplateParameter,
} from '@app/model/convs-mgr/functions';

import { OutgoingMessagePayload,TemplateMessage, TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';

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
      const templateParams: WhatsappTemplateParameter[] = message.params.map((param) =>
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
      ] as WhatsappTemplateComponent[];

      generatedMessage.template.components = templateComponents;
    }

    return generatedMessage;
  }

  /** Gets the appropriate template based on the templateType - @TemplateMessageTypes */
  parse(message: TemplateMessage, phone: string): OutgoingMessagePayload
  {
    let parser!: (message: TemplateMessage, phone: string) => OutgoingMessagePayload;

    switch (message.templateType) {
      case TemplateMessageTypes.Text:                parser = this._getTextTemplateMessage; break;
      default:
        parser = this._getTextTemplateMessage;
    }

    return parser(message, phone);
  }
}
