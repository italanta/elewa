import { HandlerTools } from "@iote/cqrs";

import { FileMessage, Message } from "@app/model/convs-mgr/conversations/messages";

import { IncomingMessageParser } from "./incoming-message.parser";

import { MessagesDataService } from "../../services/data-services/messages.service";
import { BotMediaProcessService } from "../../services/media/process-media-service";

import { ActiveChannel } from "../../model/active-channel.service";

export class IncomingFileMessageParser extends IncomingMessageParser
{

  constructor(private _activeChannel: ActiveChannel, msgService$: MessagesDataService, private _tools: HandlerTools)
  {
    super(_activeChannel, msgService$);
  }

  async getFileURL(message: Message, endUserId: string)
  {
    const processMediaService = new BotMediaProcessService(this._tools);

    const fileMessage = message as FileMessage;

    fileMessage.url = await processMediaService.processMediaFile(message, endUserId, this._activeChannel) || null;
    
    return fileMessage.url;
  }
}