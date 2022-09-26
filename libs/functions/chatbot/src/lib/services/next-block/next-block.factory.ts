import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { HandlerTools, Logger } from "@iote/cqrs";
import { QuestionMessageService } from "./block-type/question-block.service";
import { TextMessageService } from "./block-type/text-block.service";

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