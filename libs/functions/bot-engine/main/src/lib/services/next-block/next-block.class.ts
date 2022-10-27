import { HandlerTools } from "@iote/cqrs";

import { Block } from "@app/model/convs-mgr/conversations/chats";

import { Message } from "@app/model/convs-mgr/conversations/messages";
import { BlockDataService } from "../data-services/blocks.service";
import { ConnectionsDataService } from "../data-services/connections.service";

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
    abstract getNextBlock(msg: Message, lastBlock: Block): Promise<Block>


}