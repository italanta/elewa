import { Block } from "@app/model/convs-mgr/conversations/chats";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools, Logger } from "@iote/cqrs";

import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";

import { Message } from "@app/model/convs-mgr/conversations/messages";

import { NextBlockService } from "../next-block.class";
import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { InteractiveButtonMessage, InteractiveRawButtonReplyMessage } from "@app/model/convs-mgr/functions";

/** 
 * Handles the next block incase the last block was a question to the user
 */
export class QuestionMessageService extends NextBlockService {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;

    constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools){
        super(tools)
        this._logger = tools.Logger
    }

    async getNextBlock(msg: Message, lastBlock?: QuestionMessageBlock): Promise<Block>{

        const response = msg.message as InteractiveRawButtonReplyMessage

        const matchInput = new MatchInputService();

        // Set the match strategy to exactMatch
        // TODO: Add a dynamic way of selecting matching strategies
        matchInput.setMatchStrategy(new ExactMatch())

        const selectedOptionIndex = matchInput.matchId(response.interactive.button_reply.id, lastBlock.options)

        if (selectedOptionIndex == -1){
            this._logger.error(()=> `The message did not match any option found`)
        }
      
        const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`

        const connection = await this._connDataService.getConnByOption(sourceId)

        const nextBlock = await this._blockDataService.getBlockById(connection.targetId)

        return nextBlock
    }
    
}