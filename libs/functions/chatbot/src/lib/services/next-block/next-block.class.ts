import { HandlerTools, Logger } from "@iote/cqrs";

import { ChatBotStore } from "@app/functions/chatbot";

import { Block, ChatInfo } from "@app/model/convs-mgr/conversations/chats";
import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Message } from "@app/model/convs-mgr/conversations/messages";

export abstract class NextBlockService {

    tools: HandlerTools;
    constructor(tools: HandlerTools){
        this.tools = tools
    }

    /**
     * Default method that returns the block connected to the default option of the block
     * Applies for blocks which only have one target block e.g. Text Message Block
     * @returns Block
     */
    async getNextBlock(msg: Message, lastBlock: Block): Promise<Block>{
        const blockConnRepo$ =  new ChatBotStore(this.tools).blockConnections()
        
        const connection = await blockConnRepo$.getConnBySourceId(lastBlock.id, msg)
        let nextBlock: Block = await blockConnRepo$.getBlockById(connection.targetId, msg)

        return nextBlock
    }


}