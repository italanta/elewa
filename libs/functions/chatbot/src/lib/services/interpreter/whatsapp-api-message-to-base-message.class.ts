import { BaseChannel, WhatsappChannel } from '@app/model/bot/channel';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { InteractiveRawButtonReplyMessage, TextMessagePayload, WhatsAppMessageType, WhatsAppResponse } from '@app/model/convs-mgr/functions';
import { ReceiveMessageInterpreter } from './receive-message-interpreter-abstract.class';


/**
 * Interprets messages received from whatsapp and converts them to a BaseMessage
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */
export class WhatsappReceiveMessageInterpreter extends ReceiveMessageInterpreter {


/**
 * Converts simple whatsapp text message to Base Message
 * Payload example:
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
 */
  protected interpretTextMessage(msg: WhatsAppResponse, channel: WhatsappChannel): BaseMessage {

    const textMessage = msg.message as TextMessagePayload

    // Create the base message object
    const newMessage: BaseMessage = {
      phoneNumber: msg.botUserPhoneNumber,
      // businessPhoneNumber: channel.businessPhoneNumber,
      businessAccountId: channel.businessAccountId,
      channelName: channel.channelName,
      storyId: channel.storyId,
      orgId: channel.orgId,
      message: textMessage.text.body,
      platform: channel.channelName,
      authorizationKey: channel.authorizationKey,
    };

    return newMessage;
  }

/**
 * Converts an interactive whatsapp message to Base Message
 * An interactive message works well with a question block, as the user will be given options to click
 * When they click an option we will get the id of the button clicked and the text of the button
 * Payload example:
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#reply-button
 */
  protected interpretInteractiveButtonMessage(msg: WhatsAppResponse, channel: BaseChannel): BaseMessage {

    const interactiveMessage = msg.message as InteractiveRawButtonReplyMessage

    const baseMessage: BaseMessage = {
        phoneNumber: msg.botUserPhoneNumber,
        businessAccountId: channel.businessAccountId,
        channelName: channel.channelName,
        storyId: channel.storyId,
        orgId: channel.orgId,

        // Interactive message also contains the id of the button clicked
        // To add match strategy for that matches the id of the button instead of the text
        message: interactiveMessage.interactive.button_reply.title,
        platform: channel.channelName,
        authorizationKey: channel.authorizationKey,
    }

    return baseMessage
}

}
