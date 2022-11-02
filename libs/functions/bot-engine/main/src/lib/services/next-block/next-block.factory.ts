import { HandlerTools, Logger } from "@iote/cqrs";

import { QuestionMessageService } from "./block-type/question-block.service";
import { DefaultOptionMessageService } from "./block-type/text-block.service";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { BlockDataService } from "../data-services/blocks.service";
import { ConnectionsDataService } from "../data-services/connections.service";


/**
 * Factory to resolve block type and return the appropriate service that gets the next block
 * 
 * TODO: Add more services to handle more types of blocks
 */
export class NextBlockFactory {
    constructor(){}

    resoveBlockType(blockType: StoryBlockTypes, tools: HandlerTools, blockDataService: BlockDataService, connDataService: ConnectionsDataService){
        switch (blockType) {
            case StoryBlockTypes.TextMessage:
                return new DefaultOptionMessageService(blockDataService,connDataService, tools)  
            case StoryBlockTypes.QuestionBlock:
                return new QuestionMessageService(blockDataService,connDataService, tools);            
            default:
                return new DefaultOptionMessageService(blockDataService,connDataService, tools)      
        }
    }
}