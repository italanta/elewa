import { MessengerOutgoingMessage } from "./messenger-base-outgoing-message.interface";

export interface MessengerOutgoingButtonMessage extends MessengerOutgoingMessage { 
  message: {
    attachment: {
      type: string;
      payload: {
        template_type: string;
        text: string;
        buttons: MessengerOutgoingButtons[]
      }   
    }
  }
}

export interface MessengerOutgoingButtons { 
  type: string; // E.g. "postback", "web_url", "phone_number", 
  title: string;
  payload: string;
}
