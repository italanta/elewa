import { IncomingMessageParser } from '@app/functions/bot-engine';

import { AudioMessage, ImageMessage, LocationMessage, QuestionMessage, TextMessage, VideoMessage } from '@app/model/convs-mgr/conversations/messages';
import { AudioPayload, ImagePayload, InteractiveListReplyMessage, InteractiveMessageType, InteractiveRawButtonReplyMessage, LocationPayload, MessageTypes, TextMessagePayload, VideoPayload, WhatsappInteractiveMessage, WhatsAppMessagePayLoad } from '@app/model/convs-mgr/functions';

/**
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ...
 *
 * We therefore need to convert this message to a standardized format so that our chatbot can read and process the message
 *
 * Here we define methods that parse in messages  received from whatsapp and return a standardized format required by the chatbot
 *
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 *
 * @param {message} - This is the incoming message from whatsapp via the communication channel @see {CommunicationChannel}
 *
 */
export class WhatsappIncomingMessageParser extends IncomingMessageParser
{
  /**
   * Converts simple whatsapp text message to Base Message
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
   */
  protected parseInTextMessage(message: TextMessagePayload): TextMessage
  {
    // Create the base message object
    const newMessage: TextMessage = {
      id: this.getMessageId(),
      type: MessageTypes.TEXT,
      endUserPhoneNumber: message.from,
      text: message.text.body,
      payload: message,
    };

    return newMessage;
  }

  protected parseInInteractiveMessage(message: WhatsAppMessagePayLoad): QuestionMessage
  {
    const interactiveMessage = message as WhatsappInteractiveMessage;

    switch (interactiveMessage.interactive.type) {
      case InteractiveMessageType.ButtonReply:
        return this.__parseInInteractiveButtonMessage(message);
      case InteractiveMessageType.ListReply:
        return this.__parseInListMessage(message);
      default:
        return null;
    }
  }

  /**
   * Converts an interactive whatsapp message to a standadized Question Message @see {QuestionMessage}
   *
   * An interactive message works well with a question block, as the user will be given options to click
   *
   * When they click an option we will get the id of the button clicked and the text of the button
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#reply-button
   */
  private __parseInInteractiveButtonMessage(message: WhatsAppMessagePayLoad): QuestionMessage
  {
    const interactiveMessage = message as InteractiveRawButtonReplyMessage;

    const baseMessage: QuestionMessage = {
      id: this.getMessageId(),
      type: MessageTypes.QUESTION,
      endUserPhoneNumber: message.from,
      options: [
        {
          optionId: interactiveMessage.interactive.button_reply.id,
          optionText: interactiveMessage.interactive.button_reply.title,
        },
      ],
      payload: message,
    };

    return baseMessage;
  }

  private __parseInListMessage(message: WhatsAppMessagePayLoad): QuestionMessage
  {
    const interactiveMessage = message as InteractiveListReplyMessage;

    const baseMessage: QuestionMessage = {
      id: this.getMessageId(),

      type: MessageTypes.QUESTION,
      endUserPhoneNumber: message.from,
      options: [
        {
          optionId: interactiveMessage.interactive.list_reply.id,
          optionText: interactiveMessage.interactive.list_reply.title,
        },
      ],
      payload: message,
    };

    return baseMessage;
  }

  /**
   * Converts an location whatsapp message to a standadized location Message @see {LocationMessageBlock}
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#location-messages
   */
  protected parseInLocationMessage(incomingMessage: LocationPayload): LocationMessage
  {
    const standardMessage: LocationMessage = {
      id: this.getMessageId(),
      type: MessageTypes.LOCATION,
      endUserPhoneNumber: incomingMessage.from,
      location: incomingMessage.location,
      payload: incomingMessage,
    };

    return standardMessage;
  }

  /**
   * Converts an location whatsapp message to a standadized image Message
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#media-messages
   */
  protected parseInImageMessage(incomingMessage: ImagePayload): ImageMessage
  {
    const standardMessage: ImageMessage = {
      id: incomingMessage.id,
      type: MessageTypes.IMAGE,
      endUserPhoneNumber: incomingMessage.from,
      imageId: incomingMessage.id,
      payload: incomingMessage,
      mime_type: incomingMessage.image.mime_type,
    };

    return standardMessage;
  }

  /**
   * Converts an audio whatsapp message to a standadized audio Message
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#media-messages
   */
  protected parseInAudioMessage(incomingMessage: AudioPayload): AudioMessage
  {
    const standardMessage: AudioMessage = {
      id: incomingMessage.id,
      type: MessageTypes.AUDIO,
      endUserPhoneNumber: incomingMessage.from,
      audioId: incomingMessage.id,
      payload: incomingMessage,
      mime_type: incomingMessage.audio.mime_type,
    };

    return standardMessage;
  }

  /**
   * Converts an audio whatsapp message to a standadized audio Message
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#media-messages
   */

  protected parseInVideoMessage(incomingMessage: VideoPayload): VideoMessage
  {
    const standardMessage: VideoMessage = {
      id: this.getMessageId(),
      type: MessageTypes.VIDEO,
      endUserPhoneNumber: incomingMessage.from,
      videoId: incomingMessage.id,
      payload: incomingMessage,
      mime_type: incomingMessage.video.mime_type,
}
