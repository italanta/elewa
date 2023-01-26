import { HandlerTools } from "@iote/cqrs";

import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";
import { IncomingFileMessageParser } from "./file-message-parser.class";


export abstract class IncomingImageMessageParser extends IncomingFileMessageParser
{
  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools)
  {
    super(activeChannel, msgService$, tools);
  }

  protected abstract parseInImageMessage(incomingMessage: IncomingMessagePayload): Message;
}