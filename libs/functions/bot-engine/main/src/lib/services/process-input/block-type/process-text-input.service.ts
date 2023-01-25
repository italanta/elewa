import { HandlerTools } from "@iote/cqrs";

import { Message, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { ProcessInput } from "../process-input.class";

import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { IProcessInput } from "../models/process-input.interface";

export class ProcessTextInput extends ProcessInput<string> implements IProcessInput {

  constructor(tools: HandlerTools){
    super(tools)
  }

  public async handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<boolean> 
  {
      const textMessage = message as TextMessage;

      this.setVariableName(lastBlock.type); // Depends on the input block sent to the user

      const inputValue = textMessage.text
      
      if (message.type !== MessageTypes.TEXT) return false;

      return this.saveInput(orgId, endUserId, inputValue); 
  }

  private setVariableName (lastBlockType: StoryBlockTypes) {
    switch (lastBlockType) {
      case StoryBlockTypes.Name:
        this.variableName = "name"; // To later pick this value from the specific block id and variable assigned
      case StoryBlockTypes.Email:
        this.variableName = "email";
      default:
        // Otherwise generate random name for variable, with the StoryBlockType
        break;
    }
  }
}