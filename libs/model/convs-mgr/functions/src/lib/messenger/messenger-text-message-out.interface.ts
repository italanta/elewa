import { MessengerOutgoingMessage } from "./messenger-base-outgoing-message.interface";

export interface MessengerOutgoingTextMessage extends MessengerOutgoingMessage { 
  message: {
    text: string;
  };
}
