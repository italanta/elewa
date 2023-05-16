import { IncomingAudioMessageParser } from "@app/functions/bot-engine";
import { AudioMessage, IncomingMessagePayload } from "@app/model/convs-mgr/conversations/messages";

export class MessengerIncomingAudioParser extends IncomingAudioMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessagePayload): AudioMessage {

    return null;
  }
}