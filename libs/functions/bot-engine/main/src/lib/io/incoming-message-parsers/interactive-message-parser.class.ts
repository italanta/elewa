import { HandlerTools } from "@iote/cqrs";

import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";
import { IncomingFileMessageParser } from "./file-message-parser.class";
import { IncomingMessageParser } from "./incoming-message.parser";


export abstract class IncomingInteractiveMessageParser extends IncomingMessageParser
{
  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools)
  {
    super(activeChannel, msgService$);
  }

  protected abstract parseInInteractiveMessage(incomingMessage: IncomingMessagePayload): Message;
}