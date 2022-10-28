import { IncomingMessageParser } from '@app/functions/bot-engine';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { InteractiveRawButtonReplyMessage, TextMessagePayload } from '@app/model/convs-mgr/functions';

/**
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ...
 * 
 * We therefore need to convert this message to a standardized format so that our chatbot can read and process the message
 * 
 * Here we define methods that parse in messages  received from whatsapp and return a standardized format required by the chatbot
 *   
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 * 
 * @param {message} - This is the incoming message from whatsapp via the communication channel @see {CommunicationChannel}
 *
 */
export class WhatsappIncomingMessageParser extends IncomingMessageParser {


/**
 * Converts simple whatsapp text message to Base Message
 * Payload example:
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
 */
  protected parseInTextMessage(message: any): Message {

    const textMessage = message.message as TextMessagePayload

    // Create the base message object
    const newMessage: Message = {
      phoneNumber: message.botUserPhoneNumber,
      message: textMessage.text.body,
      platform: message.platform,
    };

    return newMessage;
  }

/**
 * Converts an interactive whatsapp message to Base Message
 * An interactive message works well with a question block, as the user will be given options to click
 * When they click an option we will get the id of the button clicked and the text of the button
 * Payload example:
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#reply-button
 */
  protected parseInInteractiveButtonMessage(message: any): Message {

    const interactiveMessage = message.message as InteractiveRawButtonReplyMessage

    const baseMessage: Message = {
        phoneNumber: message.botUserPhoneNumber,
        message: interactiveMessage,
        platform: message.platform,
    }

    return baseMessage
}

}
