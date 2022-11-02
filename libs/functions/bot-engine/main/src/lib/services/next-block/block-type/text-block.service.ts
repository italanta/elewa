import { HandlerTools, Logger } from "@iote/cqrs";


import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";

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
     * @returns Next StoryBlock
     */
    async getNextBlock(msg: Message, lastBlock: TextMessageBlock): Promise<StoryBlock>{

        const connection = await this._connDataService.getConnBySourceId(lastBlock.id)
        let nextBlock: StoryBlock = await this._blockDataService.getBlockById(connection.targetId)

        return nextBlock
    }
}