import { BaseChannel } from "@app/model/bot/channel";
import { Message } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

/**
 * Base class for interpreting the received raw message from the Webhook to Base Message 
 */
export abstract class IncomingMessageParser
{ 
  /** Interprets a text message to BaseMessage */
  protected abstract parseInTextMessage(msg: any, channel: BaseChannel): Message

  /** Interprets an interactive message to BaseMessage */
  protected abstract parseInInteractiveButtonMessage(msg: any, channel: BaseChannel): Message

  /** Returns the appropriate interprating method based on message type */
  parse(messageType: MessageTypes, msg: any, channel: BaseChannel): Message
  {
    let parser!: ((msg: any, channel: BaseChannel) => Message);

    switch (messageType) 
    {
      case MessageTypes.TEXT:         parser = this.parseInTextMessage; break;
      case MessageTypes.INTERACTIVE:  parser = this.parseInInteractiveButtonMessage; break;
      // default:
      //     break;
    }

    return parser(msg, channel);
  }
}