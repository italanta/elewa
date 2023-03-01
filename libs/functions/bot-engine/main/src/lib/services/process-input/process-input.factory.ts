import { HandlerTools } from "@iote/cqrs";

import { Message } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { ProcessLocationInput } from "./block-type/process-location-input.service";
import { ProcessMediaInput } from "./block-type/process-media-input.service";
import { ProcessTextInput } from "./block-type/process-text-input.service";
import { ProcessOptionsInput } from "./block-type/process-options-input.service";
import { ActiveChannel } from "../../model/active-channel.service";
import { BotMediaProcessService } from "../media/process-media-service";


export class ProcessInputFactory 
{
  constructor(private tools: HandlerTools, private _activeChannel: ActiveChannel, private processMediaService: BotMediaProcessService){}

  processInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string) {
    switch (message.type) {
      case MessageTypes.TEXT:
        return new ProcessTextInput(this.tools).handleInput(message, lastBlock, orgId, endUserId);
      case MessageTypes.LOCATION:
        return new ProcessLocationInput(this.tools).handleInput(message, lastBlock, orgId, endUserId);
      case MessageTypes.QUESTION:
        return new ProcessOptionsInput(this.tools).handleInput(message, lastBlock, orgId, endUserId);
      case MessageTypes.IMAGE:
        return new ProcessMediaInput(this.tools, this._activeChannel, this.processMediaService).handleInput(message, lastBlock, orgId, endUserId);
      case MessageTypes.VIDEO:
        return new ProcessMediaInput(this.tools, this._activeChannel, this.processMediaService).handleInput(message, lastBlock, orgId, endUserId);
      case MessageTypes.AUDIO:
        return new ProcessMediaInput(this.tools, this._activeChannel, this.processMediaService).handleInput(message, lastBlock, orgId, endUserId);
      default:
        break;
    }
  }
}