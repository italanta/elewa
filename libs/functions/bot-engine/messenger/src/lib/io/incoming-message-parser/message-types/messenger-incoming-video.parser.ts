import { IncomingVideoMessageParser } from "@app/functions/bot-engine";
import { IncomingMessagePayload, VideoMessage } from "@app/model/convs-mgr/conversations/messages";

export class MessengerIncomingVideoParser extends IncomingVideoMessageParser {

  constructor() 
  {
    super();
  }

   parse(incomingMessage: IncomingMessagePayload): VideoMessage {
    return null;
  }
}