import { IncomingVideoMessageParser } from "@app/functions/bot-engine";
import { IncomingMessagePayload, VideoMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes , VideoPayload } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingVideoParser extends IncomingVideoMessageParser {

  constructor() 
  {
    super();
  }

   parse(incomingMessage: IncomingMessagePayload): VideoMessage {
    const incomingVideoMessage =  incomingMessage as VideoPayload

    // Create the base message object
    const standardMessage: VideoMessage = {
      id: Date.now().toString(),
      type: MessageTypes.VIDEO,
      endUserPhoneNumber: incomingVideoMessage.from,
      mediaId: incomingVideoMessage.id,
      payload: incomingVideoMessage,
      mime_type: incomingVideoMessage.video.mime_type,
    }

    return standardMessage;
  }
}