import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingLocationMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { IncomingMessagePayload, LocationMessage } from "@app/model/convs-mgr/conversations/messages";
import { LocationPayload, MessageTypes } from "@app/model/convs-mgr/functions";

export class MessengerIncomingLocationParser extends IncomingLocationMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessagePayload): LocationMessage {

    return null;
  }

}