import { BaseChannel } from "@app/model/bot/channel";
import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

/**
 * Base class for interpreting the received raw message from the Webhook to Base Message 
 */
export abstract class ReceiveMessageInterpreter {

    /** Interprets a text message to BaseMessage */
    protected abstract interpretTextMessage(msg: any, channel: BaseChannel): BaseMessage

    /** Interprets an interactive message to BaseMessage */
    protected abstract interpretInteractiveButtonMessage(msg: any, channel: BaseChannel): BaseMessage

    /** Returns the appropriate interprating method based on message type */
    resolveMessageType(messageType: MessageTypes): (msg: any, channel: BaseChannel) => BaseMessage {
        switch (messageType) {
            case MessageTypes.TEXT:
                return this.interpretTextMessage
            case MessageTypes.INTERACTIVE:
                return this.interpretInteractiveButtonMessage
            default:
                break;
        }
    }
}