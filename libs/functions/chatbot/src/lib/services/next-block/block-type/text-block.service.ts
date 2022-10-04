import { HandlerTools, Logger } from "@iote/cqrs";

import { NextBlockService } from "../next-block.class";

import { Block, ChatInfo } from "@app/model/convs-mgr/conversations/chats";
import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { Message } from "@app/model/convs-mgr/conversations/messages";
import { ChatBotStore } from "@app/functions/chatbot";

export class TextMessageService extends NextBlockService {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;
    constructor(tools: HandlerTools){
        super(tools)
        this.tools = tools
    }

    /**
     * Returns the block connected to the default option of the text block
     * @returns Next Block
     */
    async getNextBlock(msg: Message, lastBlock: TextMessageBlock): Promise<Block>{
        const blockConnRepo$ =  new ChatBotStore(this.tools).blockConnections()
        
        const connection = await blockConnRepo$.getConnBySourceId(lastBlock.id, msg)
        let nextBlock: Block = await blockConnRepo$.getBlockById(connection.targetId, msg)

        return nextBlock
    }
}