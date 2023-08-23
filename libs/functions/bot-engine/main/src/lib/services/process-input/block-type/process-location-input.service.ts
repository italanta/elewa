import { HandlerTools } from "@iote/cqrs";

import { LocationMessage, Message } from "@app/model/convs-mgr/conversations/messages";
import { Location } from "@app/model/convs-mgr/stories/blocks/messaging";
import { MessageTypes } from "@app/model/convs-mgr/functions";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

import { ProcessInput } from "../process-input.class";

import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { IProcessInput } from "../models/process-input.interface";

export class ProcessLocationInput extends ProcessInput<Location> implements IProcessInput
{
  constructor(tools: HandlerTools)
  {
    super(tools);
  }

  public async handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUser: EndUser): Promise<boolean> 
  {
    const locationMessage = message as LocationMessage;

    this.variableName = "location";

    const inputValue = locationMessage.location;

    if (message.type !== MessageTypes.LOCATION) return false;

    return this.saveInput(orgId, endUser, inputValue, message.type);
  }
}