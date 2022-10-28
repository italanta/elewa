
import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

/** 
 *  After the bot engine processes the incoming message and returns the next block,
 *      the block is parsed through the @see {OutgoingMessageParser}, which returns a
 *          a prepared  message that can be sent over the line to its specific channel API. 
 * 
 * This abstract class defines the method that sends the outgoing message over the channel API endpoint
 * 
 * @param {message} - The prepared  message which can be sent over the line to its specific channel API
 * @param {channel} - Contains the information that determines the channel the end user is using to communicate
 *                      with the chatbot
 * */
export abstract class SendMessageModel {
    abstract sendMessage(message: any, channel: CommunicationChannel): void
}