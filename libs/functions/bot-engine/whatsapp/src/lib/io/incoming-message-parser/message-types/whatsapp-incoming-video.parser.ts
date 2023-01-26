import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingVideoMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { IncomingMessagePayload, VideoMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes , VideoPayload } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingVideoParser extends IncomingVideoMessageParser {

  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools) 
  {
    super(activeChannel, msgService$, tools);
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
      mime_type: incomingVideoMessage.mime_type,
    }

    return standardMessage;
  }

  save(message: VideoMessage, endUserId: string) {
    return this.saveFileMessage(message, endUserId);
  }
}