import { HandlerTools } from "@iote/cqrs";

import { LocationMessage, Message } from "@app/model/convs-mgr/conversations/messages";
import { Location } from "@app/model/convs-mgr/stories/blocks/messaging";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { ProcessInput } from "../process-input.class";

import { StoryBlock, VariableTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { IProcessInput } from "../models/process-input.interface";

export class ProcessLocationInput extends ProcessInput<Location> implements IProcessInput
{
  constructor(tools: HandlerTools)
  {
    super(tools);
  }

  public async handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<boolean> 
  {
    const locationMessage = message as LocationMessage;

    this.variableName = "location";

    const inputValue = locationMessage.location;

    if (message.type !== MessageTypes.LOCATION) return false;

    return this.saveInput(orgId, endUserId, inputValue, message.type);
  }
}