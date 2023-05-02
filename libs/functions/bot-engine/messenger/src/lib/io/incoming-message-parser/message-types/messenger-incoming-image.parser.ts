import { IncomingImageMessageParser } from "@app/functions/bot-engine";
import { ImageMessage, IncomingMessagePayload } from "@app/model/convs-mgr/conversations/messages";

export class MessengerIncomingImageParser extends IncomingImageMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessagePayload): ImageMessage {
    return null;
  }
}