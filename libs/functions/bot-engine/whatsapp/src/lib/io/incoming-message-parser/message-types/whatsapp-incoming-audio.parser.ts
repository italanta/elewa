import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingAudioMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { AudioMessage } from "@app/model/convs-mgr/conversations/messages";
import { AudioPayload, MessageTypes } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingTextParser extends IncomingAudioMessageParser {

  constructor(activeChannel: ActiveChannel, msgService$: MessagesDataService, tools: HandlerTools) 
  {
    super(activeChannel, msgService$, tools);
  }

  async parseInAudioMessage(incomingMessage: AudioPayload, endUserId: string): Promise<AudioMessage> {


    // Create the base message object
    const standardMessage: AudioMessage = {
      id: incomingMessage.id,
      type: MessageTypes.AUDIO,
      endUserPhoneNumber: incomingMessage.from,
      mediaId: incomingMessage.id,
      payload: incomingMessage,
      mime_type: incomingMessage.mime_type,
    };

    standardMessage.url =  await this.getFileURL(standardMessage, endUserId);

    return standardMessage;
  }
}