import { HandlerTools } from '@iote/cqrs';

import { ActiveChannel, IParseInMessage, MessagesDataService } from '@app/functions/bot-engine';
import { MessageTypes } from '@app/model/convs-mgr/functions';

import { WhatsappIncomingTextParser } from './message-types/whatsapp-incoming-text.parser';
import { WhatsappIncomingAudioParser } from './message-types/whatsapp-incoming-audio.parser';
import { WhatsappIncomingImageParser } from './message-types/whatsapp-incoming-image.parser';
import { WhatsappIncomingVideoParser } from './message-types/whatsapp-incoming-video.parser';
import { WhatsappIncomingLocationParser } from './message-types/whatsapp-incoming-location.parser';
import { WhatsappIncomingInteractiveParser } from './message-types/whatsapp-incoming-interactive.parser';


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
export class WhatsappIncomingMessageParser
{
  constructor(private activeChannel: ActiveChannel, private msgService$: MessagesDataService, private tools: HandlerTools){}

  resolve(messageType: MessageTypes): IParseInMessage
  {
    switch (messageType) {
      case MessageTypes.TEXT:
        return new WhatsappIncomingTextParser(this.activeChannel, this.msgService$, this.tools);
      case MessageTypes.AUDIO:
        return new WhatsappIncomingAudioParser(this.activeChannel, this.msgService$, this.tools);
      case MessageTypes.IMAGE:
        return new WhatsappIncomingImageParser(this.activeChannel, this.msgService$, this.tools);
      case MessageTypes.VIDEO:
        return new WhatsappIncomingVideoParser(this.activeChannel, this.msgService$, this.tools);
      case MessageTypes.LOCATION:
        return new WhatsappIncomingLocationParser(this.activeChannel, this.msgService$, this.tools);
      case MessageTypes.QUESTION:
        return new WhatsappIncomingInteractiveParser(this.activeChannel, this.msgService$, this.tools);
      default:
        return null;
    }
  }
}
