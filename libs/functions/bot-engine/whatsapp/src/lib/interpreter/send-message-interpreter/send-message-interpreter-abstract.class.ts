import { StoryBlock } from "@app/model/bot/blocks/story-block";
import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Coverts the Blocks to an API readable message payload
 * To export the existing functions from send Message to this Class 
 */
export abstract class SendMessageInterpreter {

    abstract interpretTextBlock(message: BaseMessage, block: StoryBlock): BaseMessage

    abstract interpretQuestionBlock(message: BaseMessage, block: StoryBlock): BaseMessage

    abstract interpretImageBlock(message: BaseMessage, block: StoryBlock): BaseMessage

    abstract interpretAudioBlock(message: BaseMessage, block: StoryBlock): BaseMessage

    abstract interpretVideoBlock(message: BaseMessage, block: StoryBlock): BaseMessage

    abstract interpretStickerBlock(message: BaseMessage, block: StoryBlock): BaseMessage

    abstract interpretDocumentBlock(message: BaseMessage, block: StoryBlock): BaseMessage

    abstract interpretLocationBlock(message: BaseMessage, block: StoryBlock): BaseMessage

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
                return this.interpretImageBlock
            case StoryBlockTypes.Document:
                return this.interpretDocumentBlock
            case StoryBlockTypes.Audio:
                return this.interpretAudioBlock
            case StoryBlockTypes.Video:
                return this.interpretVideoBlock
            case StoryBlockTypes.Sticker:
                return this.interpretStickerBlock
            default:
                return this.interpretTextBlock
        }
    }
}