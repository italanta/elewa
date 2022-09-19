import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools, Logger } from "@iote/cqrs";
import { Block, ChatBotService, EndUser } from "../main-chatbot.service";
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
        const chatService = new ChatBotService(this._logger)

        const selectedOptionIndex = matchInput.exactMatch(message, lastBlock.options)

        if (selectedOptionIndex == -1){
            this._logger.error(()=> `The message did not match any option found`)
        }
      
        const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`

        const connection = await chatService.getConnByOption(sourceId, user, this.tools)

        const nextBlock = await chatService.getBlockById(connection.targetId, user, this.tools)

        return nextBlock
    }
    
}