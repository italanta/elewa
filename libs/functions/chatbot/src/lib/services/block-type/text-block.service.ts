import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { HandlerTools, Logger } from "@iote/cqrs";
import { Block, ChatBotService, EndUser } from "../main-chatbot.service";
import { NextBlockInterface } from "../next-block.interface";

export class TextMessageService implements NextBlockInterface {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;
    constructor(tools: HandlerTools){
        this.tools = tools
    }

    async getNextBlock(user: EndUser, message: string, lastBlock: TextMessageBlock): Promise<Block>{
        const chatService = new ChatBotService(this._logger)
        
        const connection = await chatService.getConnBySourceId(lastBlock.id, user, this.tools)
        let nextBlock: Block = await chatService.getBlockById(connection.targetId, user, this.tools)

        return nextBlock
    }


}