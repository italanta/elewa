import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { Message, MessageTemplateConfig, OutgoingMessagePayload } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Our chatbot receives messages from different Platforms @see {PlatformType} e.g. whatsapp, telegram, etc
 * 
 * The @type {ActiveChannel} defines an ongoing communication between the end user and our chatbot
 * 
 */
export interface ActiveChannel 
{
  /** Descriptor of the channel this service controls */
  channel: CommunicationChannel;

  /**
   * Our chatbot can send different types of messages, be it a text message, a location, an image, ...
   * 
   * The channel API (responsible for sending and receiving messages) requires each of these messages to be sent in a certain format/via a certain contract.
   * 
   * @param {storyBlock}     - The StoryBlock to send. StoryBlocks are prepared messages in a format our chatbot can understand.
   * @param {phone}         - Phonenumber to which to send the message
   * 
   * @returns {Message}
   * A prepared  message which can be sent over the line to its specific channel API.
   */
  parseOutMessage(storyBlock: StoryBlock, phone: string): OutgoingMessagePayload;

  parseOutStandardMessage(message: Message, phone: string): OutgoingMessagePayload;

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
   * 
   */
  send(msg: OutgoingMessagePayload);

  getMediaFile(mediaId: string, mime_type: string);

  parseOutMessageTemplate(templateConfig: MessageTemplateConfig, phoneNumber: string, message: Message);
}