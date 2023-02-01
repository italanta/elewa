import { HandlerTools } from "@iote/cqrs";

import { FileMessage, Message } from "@app/model/convs-mgr/conversations/messages";

import { ProcessInput } from "../process-input.class";

import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { IProcessInput } from "../models/process-input.interface";

export class ProcessMediaInput extends ProcessInput<string> implements IProcessInput {

  constructor(tools: HandlerTools){
    super(tools)
  }

  public async handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<boolean> 
  {
      const fileMessage = message as FileMessage;

      this.setVariableName(lastBlock.type, lastBlock.id); // Depends on the input block sent to the user

      const inputValue = fileMessage.url;

      return this.saveInput(orgId, endUserId, inputValue); 
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