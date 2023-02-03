import { HandlerTools } from "@iote/cqrs";

import { FileMessage, Message } from "@app/model/convs-mgr/conversations/messages";

import { ProcessInput } from "../process-input.class";

import { StoryBlock, StoryBlockTypes, VariableTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { IProcessInput } from "../models/process-input.interface";

export class ProcessMediaInput extends ProcessInput<string> implements IProcessInput {

  constructor(tools: HandlerTools){
    super(tools)
  }

  public async handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<boolean> 
  {
      const fileMessage = message as FileMessage;

      // If the storyblock is already assigned a variable we use that variable first
      lastBlock.variable ? this.variableName = lastBlock.variable.name : this.setVariableName(lastBlock.type, lastBlock.id);

      const variableType = lastBlock.variable ? lastBlock.variable.type : VariableTypes.String;

      const inputValue = fileMessage.url;

      return this.saveInput(orgId, endUserId, inputValue, variableType); 
  }

  private setVariableName (lastBlockType: StoryBlockTypes, blockId: string) {
    switch (lastBlockType) {
      case StoryBlockTypes.ImageInput:
        this.variableName = `image_${blockId}`; // To later pick this value from the specific block id and variable assigned
        break;
      case StoryBlockTypes.Video:
        this.variableName = `video_${blockId}`;
        break;
      case StoryBlockTypes.AudioInput:
        this.variableName = `audio_${blockId}`;
        break;
      default:
        this.variableName = `media_${blockId}`;
        break;
    }
  }
}