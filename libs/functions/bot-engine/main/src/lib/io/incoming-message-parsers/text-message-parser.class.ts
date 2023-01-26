import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";

import { IncomingMessageParser } from "./incoming-message.parser";


export abstract class IncomingTextMessageParser extends IncomingMessageParser
{
  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService)
  {
    super(activeChannel, msgService$);
  }

  protected abstract parseInTextMessage(incomingMessage: IncomingMessagePayload,  endUserId: string): Message;
}