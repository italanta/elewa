import { MessengerMessageData } from "./incoming-messenger-message.interface";
import { IncomingMessage } from "@app/model/convs-mgr/conversations/messages";

export interface IncomingMessengerMessage extends IncomingMessage { 
  endUserPageId: string;
  pageId: string;
  timeStamp: number;
  message: MessengerMessageData;
}