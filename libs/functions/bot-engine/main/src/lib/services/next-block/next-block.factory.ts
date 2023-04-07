import { HandlerTools } from "@iote/cqrs";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { DefaultOptionMessageService } from "./block-type/default-block.service";
import { BlockDataService } from "../data-services/blocks.service";
import { ConnectionsDataService } from "../data-services/connections.service";
import { MultipleOptionsMessageService } from "./block-type/multiple-options-block.service";

/**
 * Factory to resolve block type and return the appropriate service that gets the next block
 * 
 * TODO: Add more services to handle more types of blocks
 */
export class NextBlockFactory
{
    resoveBlockType(blockType: StoryBlockTypes, tools: HandlerTools, blockDataService: BlockDataService, connDataService: ConnectionsDataService)
    {
        switch (blockType) {
            case StoryBlockTypes.QuestionBlock:
                return new MultipleOptionsMessageService(blockDataService, connDataService, tools);
            case StoryBlockTypes.ListBlock:
                return new MultipleOptionsMessageService(blockDataService, connDataService, tools);
            case StoryBlockTypes.TextMessage:
                return new DefaultOptionMessageService(blockDataService, connDataService, tools);
            default:
                return new DefaultOptionMessageService(blockDataService, connDataService, tools);
        }
    }
}