import { HandlerTools, Logger } from "@iote/cqrs";

import { QuestionMessageService } from "./block-type/question-block.service";
import { TextMessageService } from "./block-type/text-block.service";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";


/**
 * Factory to resolve block type and return the appropriate service that gets the next block
 */
export class NextBlockFactory {
    constructor(){}

    resoveBlockType(blockType: StoryBlockTypes, tools: HandlerTools){
        switch (blockType) {
            case StoryBlockTypes.TextMessage:
                return new TextMessageService(tools)  
            case StoryBlockTypes.QuestionBlock:
                return new QuestionMessageService(tools);      
            default:
                break;
        }
    }
}