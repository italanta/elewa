import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingTextMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes, TextMessagePayload } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingTextParser extends IncomingTextMessageParser {

  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools) 
  {
    super(activeChannel, msgService$);
  }

  parseInTextMessage(message: TextMessagePayload, endUserId: string): TextMessage {
    // Create the base message object
    const newMessage: TextMessage = {
      id: Date.now().toString(),
      type: MessageTypes.TEXT,
      endUserPhoneNumber: message.from,
      text: message.text.body,
      payload: message,
    };

    return newMessage;
  }
}