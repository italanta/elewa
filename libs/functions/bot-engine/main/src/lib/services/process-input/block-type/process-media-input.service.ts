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

      this.setVariableName(lastBlock.type); // Depends on the input block sent to the user

      const inputValue = fileMessage.url;
      
      // if (message.type !== MessageTypes.) return false;

      return this.saveInput(orgId, endUserId, inputValue); 
  }

  private setVariableName (lastBlockType: StoryBlockTypes) {
    switch (lastBlockType) {
      case StoryBlockTypes.Image:
        this.variableName = "image"; // To later pick this value from the specific block id and variable assigned
      case StoryBlockTypes.Video:
        this.variableName = "video";
      case StoryBlockTypes.Audio:
        this.variableName = "audio";
      default:
        this.variableName = "media";
        break;
    }
  }
}