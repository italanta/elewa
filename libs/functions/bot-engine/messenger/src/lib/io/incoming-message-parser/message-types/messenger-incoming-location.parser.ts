import { IncomingLocationMessageParser } from "@app/functions/bot-engine";
import { IncomingMessagePayload, LocationMessage } from "@app/model/convs-mgr/conversations/messages";

export class MessengerIncomingLocationParser extends IncomingLocationMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessagePayload): LocationMessage {

    return null;
  }

}