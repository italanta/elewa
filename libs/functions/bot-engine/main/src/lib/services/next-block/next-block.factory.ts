import { HandlerTools } from "@iote/cqrs";

import { DefaultOptionMessageService } from "./block-type/default-block.service";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { BlockDataService } from "../data-services/blocks.service";
import { ConnectionsDataService } from "../data-services/connections.service";


/**
 * Factory to resolve block type and return the appropriate service that gets the next block
 * 
 * TODO: Add more services to handle more types of blocks
 */
export class NextBlockFactory
{
    resoveBlockType(blockType: StoryBlockTypes, tools: HandlerTools, blockDataService: BlockDataService, connDataService: ConnectionsDataService)
    {
        return new DefaultOptionMessageService(blockDataService, connDataService, tools);
    }
}