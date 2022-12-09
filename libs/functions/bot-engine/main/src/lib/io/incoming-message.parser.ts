import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

/**
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ...
 * 
 * We therefore need to convert this message to a standardized format so that our chatbot can read and process the message
 * 
 * Here we define methods that parse in messages and return a standardized format required by the chatbot
 * 
 * @param {messageType} -  Type of the message that we receive form the end user. This is key to determining how to interpret it
 * @param {incomingMessage} - This is the incoming message from the end user via the communication channel @see {CommunicationChannel}
 * 
 * @returns {Message} - This is standardized format that our chatbot can read and process
 */
export abstract class IncomingMessageParser
{ 
  protected abstract parseInTextMessage(incomingMessage: IncomingMessagePayload): Message

  protected abstract parseInInteractiveMessage(incomingMessage: IncomingMessagePayload): Message

  protected abstract parseInLocationMessage(incomingMessage: IncomingMessagePayload): Message

  protected abstract parseInImageMessage(incomingMessage: IncomingMessagePayload): Message

  protected abstract parseInAudioMessage(incomingMessage: IncomingMessagePayload): Message

  protected abstract parseInVideoMessage(incomingMessage: IncomingMessagePayload): Message

/**
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ...
 * 
 * We therefore need to convert this message to a standardized format so that our chatbot can read and process the message
 *  
 * @param {messageType} -  Type of the message that we receive form the end user. This is key to determining how to interpret it
 * @param {incomingMessage} - This is the incoming message from the end user via the communication channel @see {CommunicationChannel}
 * 
 * @returns {Message} - This is standardized format that our chatbot can read and process
 */
  parse(messageType: MessageTypes, incomingMessage: IncomingMessagePayload): Message
  {
    let parser!: ((incomingMessage: IncomingMessagePayload) => Message);

    switch (messageType) 
    {
      case MessageTypes.TEXT:         parser = this.parseInTextMessage; break;
      case MessageTypes.QUESTION:     parser = this.parseInInteractiveMessage; break;
      case MessageTypes.LOCATION:     parser = this.parseInLocationMessage; break;
      case MessageTypes.IMAGE:        parser = this.parseInImageMessage; break;
      case MessageTypes.AUDIO:        parser = this.parseInAudioMessage; break;
      case MessageTypes.VIDEO:        parser = this.parseInVideoMessage; break;
      default:                        return null
    }

    return parser(incomingMessage);
  }

  protected getMessageId = () => Date.now().toString();
}