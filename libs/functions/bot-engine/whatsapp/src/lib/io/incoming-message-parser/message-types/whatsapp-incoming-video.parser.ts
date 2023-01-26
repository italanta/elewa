import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingVideoMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { VideoMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes , VideoPayload } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingTextParser extends IncomingVideoMessageParser {

  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools) 
  {
    super(activeChannel, msgService$, tools);
  }

  async parseInVideoMessage(incomingMessage: VideoPayload, endUserId: string): Promise<VideoMessage> {
    // Create the base message object
    const standardMessage: VideoMessage = {
      id: Date.now().toString(),
      type: MessageTypes.VIDEO,
      endUserPhoneNumber: incomingMessage.from,
      mediaId: incomingMessage.id,
      payload: incomingMessage,
      mime_type: incomingMessage.mime_type,
    }
    standardMessage.url =  await this.getFileURL(standardMessage, endUserId);

    return standardMessage;
  }
}