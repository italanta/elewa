import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

import { ActiveChannel } from "../../model/active-channel.service";
import { MessagesDataService } from "../../services/data-services/messages.service";

import { IncomingMessageParser } from "./incoming-message.parser";
import { IParseInMessage } from "./models/incoming-message-parser.interface";


export abstract class IncomingTextMessageParser extends IncomingMessageParser implements IParseInMessage
{
  abstract parse(incomingMessage: IncomingMessagePayload): Message;

}