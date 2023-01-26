import { HandlerTools } from "@iote/cqrs";

import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";
import { IncomingFileMessageParser } from "./file-message-parser.class";
import { IParseInMessage } from "./models/incoming-message-parser.interface";


export abstract class IncomingImageMessageParser extends IncomingFileMessageParser implements IParseInMessage
{
  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools)
  {
    super(activeChannel, msgService$, tools);
  }

  abstract parse(incomingMessage: IncomingMessagePayload): Message;

  abstract save(message: Message, endUserId: string);
}