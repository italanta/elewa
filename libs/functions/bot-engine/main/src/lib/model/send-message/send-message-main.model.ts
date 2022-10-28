
import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { Message } from "@app/model/convs-mgr/conversations/messages";

/** 
 *  @Descripion: Abstract Class for sending messages 
 *  Outlines all methods that can be used to send messages across different PlatformType 
 * */
export abstract class SendMessageModel {
    
    /** Checks the type of message and calls the appropriate method */
    abstract sendMessage(message: Message, channel: CommunicationChannel): void
}