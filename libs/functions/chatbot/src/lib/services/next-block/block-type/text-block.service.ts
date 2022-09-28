import { HandlerTools, Logger } from "@iote/cqrs";

import { ChatBotStore } from "@app/functions/chatbot";

import { Block, ChatInfo } from "@app/model/convs-mgr/conversations/chats";
import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { NextBlockInterface } from "../next-block.interface";

export class TextMessageService implements NextBlockInterface {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;
    constructor(tools: HandlerTools){
        this.tools = tools
    }

    /**
     * Returns the block connected to the default option of the text block
     * @returns Next Block
     */
    async getNextBlock(chatInfo: ChatInfo, message: string, lastBlock: TextMessageBlock): Promise<Block>{
        const blockConnRepo$ =  new ChatBotStore(this.tools).blockConnections()
        
        const connection = await blockConnRepo$.getConnBySourceId(lastBlock.id, chatInfo)
        let nextBlock: Block = await blockConnRepo$.getBlockById(connection.targetId, chatInfo)

        return nextBlock
    }


}