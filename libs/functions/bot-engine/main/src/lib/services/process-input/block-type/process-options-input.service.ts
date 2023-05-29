import { HandlerTools } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { ProcessInput } from "../process-input.class";

import { StoryBlock, VariableTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { IProcessInput } from "../models/process-input.interface";

export class ProcessOptionsInput extends ProcessInput<string> implements IProcessInput {
  tools: HandlerTools;

  constructor(tools: HandlerTools){
    super(tools)
    this.tools = tools;
  }

  public async handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<boolean> 
  {
    this.tools.Logger.log(()=> `ProcessOptionsInput: ${JSON.stringify(message)} ${lastBlock.message}`)

      const questionMessage = message as QuestionMessage;

      // Replace white space with underscore
      // const formattedTitle = lastBlock.blockTitle.replace(/ /g,"_").toLowerCase();

      // If the storyblock is already assigned a variable we use that variable first
      this.variableName = this.variableExists(lastBlock.variable) ? lastBlock.variable.name : `${lastBlock.id}_${lastBlock.type}`;

      const variableType = lastBlock.variable ? lastBlock.variable.type : VariableTypes.String

      const inputValue = questionMessage.options[0].optionText;
      
      if (message.type !== MessageTypes.QUESTION) return false;

      return this.saveInput(orgId, endUserId, inputValue, message.type, variableType); 
  }
}