import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools, Logger } from "@iote/cqrs";
import { Block, ChatBotStore, EndUser } from "../chatbot.store";

import { MatchInputService } from "../match-input.service";
import { NextBlockInterface } from "../next-block.interface";

/**Handles the next block incase the last block was a question to the user  */
export class QuestionMessageService implements NextBlockInterface {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;

    constructor(tools: HandlerTools){
        this.tools = tools
        this._logger = tools.Logger
    }

    async getNextBlock(user: EndUser, message: string, lastBlock?: QuestionMessageBlock): Promise<Block>{
        const matchInput = new MatchInputService();
        const chatBotRepo$ =  new ChatBotStore(this.tools)

        const selectedOptionIndex = matchInput.exactMatch(message, lastBlock.options)

        if (selectedOptionIndex == -1){
            this._logger.error(()=> `The message did not match any option found`)
        }
      
        const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`

        const connection = await chatBotRepo$.getConnByOption(sourceId, user)

        const nextBlock = await chatBotRepo$.getBlockById(connection.targetId, user)

        return nextBlock
    }
    
}