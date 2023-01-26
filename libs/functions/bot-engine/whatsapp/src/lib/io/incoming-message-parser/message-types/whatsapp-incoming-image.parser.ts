import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingImageMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { ImageMessage } from "@app/model/convs-mgr/conversations/messages";
import { ImagePayload, MessageTypes } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingImageParser extends IncomingImageMessageParser {

  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools) 
  {
    super(activeChannel, msgService$, tools);
  }

  async parseInImageMessage(incomingMessage: ImagePayload, endUserId: string): Promise<ImageMessage> {


    // Create the base message object
    const standardMessage: ImageMessage = {
      id: incomingMessage.id,
      type: MessageTypes.IMAGE,
      endUserPhoneNumber: incomingMessage.from,
      mediaId: incomingMessage.id,
      payload: incomingMessage,
      mime_type: incomingMessage.mime_type,
    };

    standardMessage.url =  await this.getFileURL(standardMessage, endUserId);

    return standardMessage;
  }
}