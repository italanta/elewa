import { HandlerTools, Logger } from "@iote/cqrs";

import { ChatBotStore } from "@app/functions/chatbot";

import { Block, ChatInfo } from "@app/model/convs-mgr/conversations/chats";
import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

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
    async getNextBlock(chatInfo: ChatInfo, message: string, lastBlock: TextMessageBlock): Promise<Block>{
        const blockConnRepo$ =  new ChatBotStore(this.tools).blockConnections()
        
        const connection = await blockConnRepo$.getConnBySourceId(lastBlock.id, chatInfo)
        let nextBlock: Block = await blockConnRepo$.getBlockById(connection.targetId, chatInfo)

        return nextBlock
    }


}