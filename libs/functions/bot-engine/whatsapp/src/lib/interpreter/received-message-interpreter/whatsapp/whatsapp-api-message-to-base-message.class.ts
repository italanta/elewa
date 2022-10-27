import { BaseChannel, WhatsappChannel } from '@app/model/bot/channel';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { InteractiveRawButtonReplyMessage, TextMessagePayload, WhatsAppResponse } from '@app/model/convs-mgr/functions';
import { ReceiveMessageInterpreter } from '../receive-message-interpreter-abstract.class';


/**
 * Interprets messages received from whatsapp and converts them to a Message
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */
export class WhatsappReceiveMessageInterpreter extends ReceiveMessageInterpreter {


/**
 * Converts simple whatsapp text message to Base Message
 * Payload example:
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
 */
  protected interpretTextMessage(msg: WhatsAppResponse, channel: WhatsappChannel): Message {

    const textMessage = msg.message as TextMessagePayload

    // Create the base message object
    const newMessage: Message = {
      phoneNumber: msg.botUserPhoneNumber,
      message: textMessage.text.body,
      platform: msg.platform,
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
  protected interpretInteractiveButtonMessage(msg: WhatsAppResponse, channel: BaseChannel): Message {

    const interactiveMessage = msg.message as InteractiveRawButtonReplyMessage

    const baseMessage: Message = {
        phoneNumber: msg.botUserPhoneNumber,
        message: interactiveMessage,
        platform: msg.platform,
    }

    return baseMessage
}

}
