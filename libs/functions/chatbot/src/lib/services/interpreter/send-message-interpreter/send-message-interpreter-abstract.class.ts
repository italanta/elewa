import { StoryBlock } from "@app/model/bot/blocks/story-block";
import { BaseChannel } from "@app/model/bot/channel";
import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Coverts the Blocks to an API readable message payload
 * To export the existing functions from send Message to this Class 
 */
export abstract class SendMessageInterpreter {

    abstract interpretTextBlock(message: BaseMessage,block: StoryBlock, channel: BaseChannel): BaseMessage

    abstract interpretQuestionBlock(message: BaseMessage,block: StoryBlock, channel: BaseChannel): BaseMessage

    abstract interpretMediaBlock(message: BaseMessage,block: StoryBlock, channel: BaseChannel): BaseMessage

    interpretBlock(blockType: StoryBlockTypes){
        switch (blockType) {
            case StoryBlockTypes.TextMessage:
                return this.interpretTextBlock  
            case StoryBlockTypes.Name:
                return this.interpretTextBlock
            case StoryBlockTypes.Email:
                return this.interpretTextBlock 
            case StoryBlockTypes.PhoneNumber:
                return this.interpretTextBlock          
            case StoryBlockTypes.QuestionBlock:
                return this.interpretQuestionBlock
            case StoryBlockTypes.Image:
                return this.interpretMediaBlock
            case StoryBlockTypes.Document:
                return this.interpretMediaBlock
            case StoryBlockTypes.Audio:
                return this.interpretMediaBlock
            case StoryBlockTypes.Video:
                return this.interpretMediaBlock
            case StoryBlockTypes.Sticker:
                return this.interpretMediaBlock
            case StoryBlockTypes.Audio:
                return this.interpretMediaBlock
            default:
                return this.interpretTextBlock
        }
    }
}