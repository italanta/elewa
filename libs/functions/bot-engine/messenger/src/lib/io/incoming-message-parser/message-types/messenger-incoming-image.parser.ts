import { IncomingImageMessageParser } from "@app/functions/bot-engine";
import { ImageMessage } from "@app/model/convs-mgr/conversations/messages";
import { IncomingMessengerMessage, MessageTypes, MessengerAttachments } from "@app/model/convs-mgr/functions";

export class MessengerIncomingImageParser extends IncomingImageMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessengerMessage): ImageMessage {
    const imagePayload = incomingMessage.message as MessengerAttachments
    // Create the base message object
    const newMessage: ImageMessage = {
      id: incomingMessage.timeStamp.toString(),
      type: MessageTypes.IMAGE,
      url: imagePayload.attachments[0].payload.url,
    };
    return newMessage;
  }
}