import { IncomingImageMessageParser } from "@app/functions/bot-engine";
import { ImageMessage } from "@app/model/convs-mgr/conversations/messages";
import { ImagePayload, MessageTypes, WhatsAppMessagePayLoad } from "@app/model/convs-mgr/functions";

export class MessengerIncomingImageParser extends IncomingImageMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: WhatsAppMessagePayLoad): ImageMessage {
    return null;
  }
}