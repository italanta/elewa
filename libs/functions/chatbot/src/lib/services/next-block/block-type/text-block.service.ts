import { HandlerTools, Logger } from "@iote/cqrs";

import { NextBlockService } from "../next-block.class";

import { Block } from "@app/model/convs-mgr/conversations/chats";
import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

export class TextMessageService extends NextBlockService {
    userInput: string;
    _logger: Logger;
    tools: HandlerTools;
    constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools){
        super(tools)
        this.tools = tools
    }

    /**
     * Returns the block connected to the default option of the text block
     * @returns Next Block
     */
    async getNextBlock(msg: BaseMessage, lastBlock: TextMessageBlock): Promise<Block>{

        const connection = await this._connDataService.getConnBySourceId(lastBlock.id)
        let nextBlock: Block = await this._blockDataService.getBlockById(connection.targetId)

        return nextBlock
    }
}