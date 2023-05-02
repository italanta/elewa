import { IncomingVideoMessageParser } from "@app/functions/bot-engine";
import { IncomingMessagePayload, VideoMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes , VideoPayload } from "@app/model/convs-mgr/functions";

export class MessengerIncomingVideoParser extends IncomingVideoMessageParser {

  constructor() 
  {
    super();
  }

   parse(incomingMessage: IncomingMessagePayload): VideoMessage {
    return null;
  }
}