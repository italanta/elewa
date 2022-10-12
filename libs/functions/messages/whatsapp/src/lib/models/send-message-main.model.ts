import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/** Abstract Class for sending messages 
 *  Outlines all methods that can be used to send messages across different platforms 
 * 
 * */
export abstract class SendMessageModel {
    
    abstract sendMessage(message: BaseMessage, blockType: StoryBlockTypes, env:any): Promise<any>

    protected abstract _sendTextMessage(message: BaseMessage, blockType: StoryBlockTypes, env:any): Promise<any>
}