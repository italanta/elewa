import { HandlerTools } from "@iote/cqrs";


import { FileMessage, Message } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { MessagesDataService } from "./data-services/messages.service";
import { BotMediaProcessService } from "./media/process-media-service";

import { ActiveChannel } from "../model/active-channel.service";

import { __isCommand } from "../utils/isCommand";

export class BotEngineMain
{
  protected orgId: string;

  private processMediaService: BotMediaProcessService;

  constructor(
    protected _msgService$: MessagesDataService,
    protected _activeChannel: ActiveChannel,
    protected _tools: HandlerTools) 
  {
    this.orgId = _activeChannel.channel.orgId;

    this.processMediaService = new BotMediaProcessService(_tools);
  }

  public async sendMessage(message: Message)
  {
    const outgoingMessage =  this._activeChannel.parseOutStandardMessage(message, message.endUserPhoneNumber);

    return this._activeChannel.send(outgoingMessage)
  }

  public async save(message: Message, endUserId: string) 
  {
    if (message.type == MessageTypes.AUDIO || message.type == MessageTypes.VIDEO || message.type == MessageTypes.IMAGE) {
      const fileMessage = message as FileMessage;

      fileMessage.url = await this.processMediaService.processMediaFile(message, endUserId, this._activeChannel) || null;

      message = fileMessage;
    }
    return this._msgService$.saveMessage(message, this.orgId, endUserId);
  };
}