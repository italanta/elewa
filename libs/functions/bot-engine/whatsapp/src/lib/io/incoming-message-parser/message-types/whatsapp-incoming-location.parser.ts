import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingLocationMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { IncomingMessagePayload, LocationMessage } from "@app/model/convs-mgr/conversations/messages";
import { LocationPayload, MessageTypes } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingLocationParser extends IncomingLocationMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessagePayload): LocationMessage {

    const incomingLocationMessage  = incomingMessage as LocationPayload
    // Create the base message object
    const standardMessage: LocationMessage = {
      id: Date.now().toString(),
      type: MessageTypes.LOCATION,
      endUserPhoneNumber: incomingLocationMessage.from,
      location: incomingLocationMessage.location,
      payload: incomingLocationMessage,
    };

    return standardMessage;
  }

}