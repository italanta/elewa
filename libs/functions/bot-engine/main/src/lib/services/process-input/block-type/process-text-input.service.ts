import { HandlerTools } from "@iote/cqrs";

import { Message, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { ProcessInput } from "../process-input.class";

import { StoryBlock, StoryBlockTypes, VariableTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { IProcessInput } from "../models/process-input.interface";

export class ProcessTextInput extends ProcessInput<string> implements IProcessInput {

  constructor(tools: HandlerTools){
    super(tools);
  }

  public async handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<boolean> 
  {
      const textMessage = message as TextMessage;

      // If the storyblock is already assigned a variable we use that variable first
      lastBlock.variable ? this.variableName = lastBlock.variable.name : this.setVariableName(lastBlock.type, lastBlock.id);

      const inputValue = textMessage.text;

      const variableType = lastBlock.variable ? lastBlock.variable.type : VariableTypes.String

      if (message.type !== MessageTypes.TEXT) return false;

      return this.saveInput(orgId, endUserId, inputValue, message.type,variableType); 
  }

  private setVariableName (lastBlockType: StoryBlockTypes, blockId: string) {
    switch (lastBlockType) {
      case StoryBlockTypes.Name:
        this.variableName = "name"; // To later pick this value from the specific block id and variable assigned
        break;
      case StoryBlockTypes.Email:
        this.variableName = "email";
        break;
      default:
        // Otherwise generate random name for variable, with the StoryBlockType
        this.variableName = `unnamed_${blockId}`;
        break;
    }
  }
}