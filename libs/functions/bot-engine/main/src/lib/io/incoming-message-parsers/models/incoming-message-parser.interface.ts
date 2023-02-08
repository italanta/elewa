import { IncomingMessagePayload, Message } from "@app/model/convs-mgr/conversations/messages";

export interface IParseInMessage {

  parse(incomingMessage: IncomingMessagePayload): Message;
}