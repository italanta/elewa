import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { IncomingFileMessageParser } from "./file-message-parser.class";
import { IParseInMessage } from "./models/incoming-message-parser.interface";


export abstract class IncomingImageMessageParser extends IncomingFileMessageParser implements IParseInMessage
{
  constructor() {
    super();
  }

  abstract parse(incomingMessage: IncomingMessagePayload): Message;
}