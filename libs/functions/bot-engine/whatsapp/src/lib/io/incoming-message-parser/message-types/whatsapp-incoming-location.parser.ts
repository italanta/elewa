import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingLocationMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { LocationMessage } from "@app/model/convs-mgr/conversations/messages";
import { LocationPayload, MessageTypes } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingTextParser extends IncomingLocationMessageParser {

  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService) 
  {
    super(activeChannel, msgService$);
  }

  parseInLocationMessage(incomingMessage: LocationPayload, endUserId: string): LocationMessage {
    // Create the base message object
    const standardMessage: LocationMessage = {
      id: Date.now().toString(),
      type: MessageTypes.LOCATION,
      endUserPhoneNumber: incomingMessage.from,
      location: incomingMessage.location,
      payload: incomingMessage,
    };

    return standardMessage;
  }
}