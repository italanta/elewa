import { BaseChannel } from "@app/model/bot/channel";
import { Message } from "@app/model/convs-mgr/conversations/messages";
import { WhatsAppMessage } from "@app/model/convs-mgr/functions";

/** 
 *  @Descripion: Abstract Class for sending messages 
 *  Outlines all methods that can be used to send messages across different PlatformType 
 * */
export abstract class SendMessageModel {
    
    /** Checks the type of message and calls the appropriate method */
    abstract sendMessage(message: Message, channel: BaseChannel): void
}