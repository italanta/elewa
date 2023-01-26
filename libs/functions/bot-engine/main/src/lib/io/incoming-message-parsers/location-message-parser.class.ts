import { HandlerTools } from "@iote/cqrs";

import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";
import { IncomingFileMessageParser } from "./file-message-parser.class";
import { IncomingMessageParser } from "./incoming-message.parser";


export abstract class IncomingLocationMessageParser extends IncomingMessageParser
{
  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService)
  {
    super(activeChannel, msgService$);
  }

  protected abstract parseInLocationMessage(incomingMessage: IncomingMessagePayload,  endUserId: string): Message;
}