import { IncomingTextMessageParser } from "@app/functions/bot-engine";
import { TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { IncomingMessengerMessage, IncomingMessengerTextMessage, MessageTypes } from "@app/model/convs-mgr/functions";

export class MessengerIncomingTextParser extends IncomingTextMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessengerMessage): TextMessage {

    const textMessagePayload = incomingMessage.message as IncomingMessengerTextMessage
    // Create the base message object
    const newMessage: TextMessage = {
      id: incomingMessage.timeStamp.toString(),
      type: MessageTypes.TEXT,
      text: textMessagePayload.text,
      payload: incomingMessage.payload,
    };

    return newMessage;
  }
}