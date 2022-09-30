import { ChatInfo, Block } from "@app/model/convs-mgr/conversations/chats";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools, Logger } from "@iote/cqrs";

import { ChatBotStore } from "@app/functions/chatbot";

import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";

import { NextBlockService } from "../next-block.class";

/** 
 * Handles the next block incase the last block was a question to the user
 */
export class QuestionMessageService extends NextBlockService {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;

    constructor(tools: HandlerTools){
        super(tools)
        this._logger = tools.Logger
    }

    /**
     * Override method to match options and return the next block based on the option selected
     * @returns Block
     */
    async getNextBlock(chatInfo: ChatInfo, message: string, lastBlock?: QuestionMessageBlock): Promise<Block>{
        const chatBotRepo$ =  new ChatBotStore(this.tools)
        const blockConnections = chatBotRepo$.blockConnections()

        const matchInput = new MatchInputService();

        // Set the match strategy to exactMatch
        // TODO: Add a dynamic way of selecting matching strategies
        matchInput.setMatchStrategy(new ExactMatch())

        const selectedOptionIndex = matchInput.match(message, lastBlock.options)

        if (selectedOptionIndex == -1){
            this._logger.error(()=> `The message did not match any option found`)
        }
      
        const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`

        const connection = await blockConnections.getConnByOption(sourceId, chatInfo)

        const nextBlock = await blockConnections.getBlockById(connection.targetId, chatInfo)

        return nextBlock
    }
    
}