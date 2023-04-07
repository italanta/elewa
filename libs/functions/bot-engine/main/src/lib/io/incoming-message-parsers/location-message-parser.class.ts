import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { IncomingMessageParser } from "./incoming-message.parser";
import { IParseInMessage } from "./models/incoming-message-parser.interface";


export abstract class IncomingLocationMessageParser extends IncomingMessageParser implements IParseInMessage
{
  constructor()
  {
    super();
  }

  abstract parse(incomingMessage: IncomingMessagePayload): Message;
}