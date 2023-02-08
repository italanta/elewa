import { HandlerTools } from "@iote/cqrs";

import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";
import { IncomingFileMessageParser } from "./file-message-parser.class";
import { IncomingMessageParser } from "./incoming-message.parser";
import { IParseInMessage } from "./models/incoming-message-parser.interface";


export abstract class IncomingInteractiveMessageParser extends IncomingMessageParser implements IParseInMessage
{
  constructor()
  {
    super();
  }

  abstract parse(incomingMessage: IncomingMessagePayload): Message;

}