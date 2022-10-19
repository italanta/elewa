import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/** 
 *  @Descripion: Abstract Class for sending messages 
 *  Outlines all methods that can be used to send messages across different platforms 
 * */
export abstract class SendMessageModel {
    
    /** Checks the type of message and calls the appropriate method */
    abstract sendMessage(message: BaseMessage, endUserPhoneNumber: string, block?: StoryBlock,): Promise<any>

    /** Converts the message to text based on platform api docs and sends it */
    protected abstract _sendTextMessage(message: BaseMessage, endUserPhoneNumber: string, block?: StoryBlock,): Promise<any>
}