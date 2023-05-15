import { MessengerAttachmentType } from "./messenger-attachment-types.enum";
import { MessengerOutgoingMessage } from "./messenger-base-outgoing-message.interface";

export interface MessengerOutgoingAttachmentMessage extends MessengerOutgoingMessage { 
  message: {
    attachment: {
      type: MessengerAttachmentType,
      payload: {
        url: string,
        is_reusable: boolean
      }
    }
  };
}
