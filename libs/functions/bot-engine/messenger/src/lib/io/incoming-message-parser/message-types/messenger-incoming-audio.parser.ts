import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingAudioMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { AudioMessage, IncomingMessagePayload } from "@app/model/convs-mgr/conversations/messages";
import { AudioPayload, MessageTypes } from "@app/model/convs-mgr/functions";

export class MessengerIncomingAudioParser extends IncomingAudioMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessagePayload): AudioMessage {

    return null;
  }
}