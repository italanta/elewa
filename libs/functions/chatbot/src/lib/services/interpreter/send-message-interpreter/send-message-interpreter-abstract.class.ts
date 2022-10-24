import { StoryBlock } from "@app/model/bot/blocks/story-block";
import { BaseChannel } from "@app/model/bot/channel";
import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";

/**
 * Coverts the Blocks to an API readable message payload
 * To export the existing functions from send Message to this Class 
 */
export abstract class SendMessageInterpreter {

    abstract interpretTextBlock(block: StoryBlock, channel: BaseChannel): BaseMessage
}