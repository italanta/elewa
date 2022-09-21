import { Block, ChatInfo } from "@app/model/convs-mgr/conversations/chats";
import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools, Logger } from "@iote/cqrs";
import { ChatBotStore } from "../chatbot.store";
// import { ChatBotStore, Block } from "../chatbot.store";
import { NextBlockInterface } from "../next-block.interface";

export class TextMessageService implements NextBlockInterface {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;
    constructor(tools: HandlerTools){
        this.tools = tools
    }

    async getNextBlock(chatInfo: ChatInfo, message: string, lastBlock: TextMessageBlock): Promise<Block>{
        const chatBotRepo$ =  new ChatBotStore(this.tools)
        
        const connection = await chatBotRepo$.getConnBySourceId(lastBlock.id, chatInfo)
        let nextBlock: Block = await chatBotRepo$.getBlockById(connection.targetId, chatInfo)

        return nextBlock
    }


}