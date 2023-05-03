import { IParseInMessage } from '@app/functions/bot-engine';
import { MessageTypes } from '@app/model/convs-mgr/functions';

import { MessengerIncomingTextParser } from './message-types/messenger-incoming-text.parser';


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
export class MessengerIncomingMessageParser
{

  resolve(messageType: MessageTypes): IParseInMessage
  {
    switch (messageType) {
      case MessageTypes.TEXT:
        return new MessengerIncomingTextParser();
      // case MessageTypes.AUDIO:
      //   return new WhatsappIncomingAudioParser();
      // case MessageTypes.IMAGE:
      //   return new WhatsappIncomingImageParser();
      // case MessageTypes.VIDEO:
      //   return new WhatsappIncomingVideoParser();
      // case MessageTypes.LOCATION:
      //   return new WhatsappIncomingLocationParser();
      // case MessageTypes.QUESTION:
      //   return new WhatsappIncomingInteractiveParser();
      default:
        return null;
    }
  }
}
