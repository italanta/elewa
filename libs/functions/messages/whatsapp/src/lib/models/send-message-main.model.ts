import { BaseChannel } from "@app/model/bot/channel";
import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { WhatsAppBaseMessage } from "@app/model/convs-mgr/functions";

/** 
 *  @Descripion: Abstract Class for sending messages 
 *  Outlines all methods that can be used to send messages across different platforms 
 * */
export abstract class SendMessageModel {
    
    /** Checks the type of message and calls the appropriate method */
    abstract sendMessage(message: BaseMessage, channel: BaseChannel): void
}