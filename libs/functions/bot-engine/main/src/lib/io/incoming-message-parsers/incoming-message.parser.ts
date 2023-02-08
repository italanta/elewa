import { Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";

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
export class IncomingMessageParser
{ 
  constructor() {}

  protected getMessageId = () => Date.now().toString();
}