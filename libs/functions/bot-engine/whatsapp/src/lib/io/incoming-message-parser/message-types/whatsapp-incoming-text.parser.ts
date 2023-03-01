import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingTextMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { IncomingMessagePayload, Message, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes, TextMessagePayload } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingTextParser extends IncomingTextMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessagePayload): TextMessage {

    const textMessagePayload = incomingMessage as TextMessagePayload
    // Create the base message object
    const newMessage: TextMessage = {
      id: Date.now().toString(),
      type: MessageTypes.TEXT,
      endUserPhoneNumber: textMessagePayload.from,
      text: textMessagePayload.text.body,
      payload: incomingMessage,
    };

    return newMessage;
  }
}