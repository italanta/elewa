import { IncomingImageMessageParser } from "@app/functions/bot-engine";
import { ImageMessage } from "@app/model/convs-mgr/conversations/messages";
import { ImagePayload, MessageTypes, WhatsAppMessagePayLoad } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingImageParser extends IncomingImageMessageParser {

  constructor() 
  {
    super();
  }

  parse(incomingMessage: WhatsAppMessagePayLoad): ImageMessage {
    const incomingImageMessage =  incomingMessage as ImagePayload;

    // Create the base message object
    const standardMessage: ImageMessage = {
      id: Date.now().toString(),
      type: MessageTypes.IMAGE,
      endUserPhoneNumber: incomingImageMessage.from,
      mediaId: incomingImageMessage.image.id,
      payload: incomingImageMessage,
      mime_type: incomingImageMessage.image.mime_type,
    };


    return standardMessage;
  }
}