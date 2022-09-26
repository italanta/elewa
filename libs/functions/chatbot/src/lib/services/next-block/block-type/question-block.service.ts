import { ChatInfo, Block } from "@app/model/convs-mgr/conversations/chats";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools, Logger } from "@iote/cqrs";
import { ChatBotStore } from "../../chatbot.store";

import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";
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

    async getNextBlock(chatInfo: ChatInfo, message: string, lastBlock?: QuestionMessageBlock): Promise<Block>{
        const chatBotRepo$ =  new ChatBotStore(this.tools)
        const matchInput = new MatchInputService();

        // Set the match strategy to exactMatch
        // TODO: Add a dynamic way of selecting matching strategies
        matchInput.setMatchStrategy(new ExactMatch())

        const selectedOptionIndex = matchInput.match(message, lastBlock.options)

        if (selectedOptionIndex == -1){
            this._logger.error(()=> `The message did not match any option found`)
        }
      
        const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`

        const connection = await chatBotRepo$.getConnByOption(sourceId, chatInfo)

        const nextBlock = await chatBotRepo$.getBlockById(connection.targetId, chatInfo)

        return nextBlock
    }
    
}