import { StoryBlock } from "@app/model/bot/blocks/story-block";
import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/** TODO: Refactor the function to handle the message being passed */

/**
 * Defines methods that translates storyblocks to a format that can be handled by different platforms
 * 
 * @param {block} - This is passed to determine the fields 
 *
 */
export abstract class OutgoingMessageParser
{
  /** Take */
  abstract getTextBlockParserOut     (message: BaseMessage, block: StoryBlock): BaseMessage

  abstract getQuestionBlockParserOut (message: BaseMessage, block: StoryBlock): BaseMessage

  abstract getImageBlockParserOut    (message: BaseMessage, block: StoryBlock): BaseMessage

  abstract getAudioBlockParserOut    (message: BaseMessage, block: StoryBlock): BaseMessage

  abstract getVideoBlockParserOut    (message: BaseMessage, block: StoryBlock): BaseMessage

  abstract getStickerBlockParserOut  (message: BaseMessage, block: StoryBlock): BaseMessage

  abstract getDocumentBlockParserOut (message: BaseMessage, block: StoryBlock): BaseMessage

  abstract getLocationBlockParserOut (message: BaseMessage, block: StoryBlock): BaseMessage

  /**
   * Our chatbot can send different types of messages, be it a text message, a location, an image, ...
   * 
   * The channel API (responsible for sending and receiving messages) requires each of these messages to be sent in a certain format/via a certain contract.
   * 
   * @param {StoryBlockType} - Type of the message that we want to send. This is key to determining how to send it.
   * @param {StoryBlock}     - The StoryBlock to send. StoryBlocks are prepared messages in a format our chatbot can understand.
   * @param {string}         - Phonenumber to which to send the message
   * 
   * @returns {Message}
   * A prepared  message which can be sent over the line to its specific channel API.
   */
  parse(storyBlockType: StoryBlockTypes, s: StoryBlock, phone: string) : BaseMessage
  {
    let parser!: (message: BaseMessage, phone: string) => BaseMessage;
    
    switch (storyBlockType) {
      case StoryBlockTypes.TextMessage:   parser = this.interpretTextBlock;     break;
      case StoryBlockTypes.Name:          parser = this.interpretTextBlock;     break;
      case StoryBlockTypes.Email:         parser = this.interpretTextBlock;     break;
      case StoryBlockTypes.PhoneNumber:   parser = this.interpretTextBlock;     break;   
      case StoryBlockTypes.QuestionBlock: parser = this.interpretQuestionBlock; break;
      case StoryBlockTypes.Image:         parser = this.interpretImageBlock;    break;
      case StoryBlockTypes.Document:      parser = this.interpretDocumentBlock; break;
      case StoryBlockTypes.Audio:         parser = this.interpretAudioBlock;    break;
      case StoryBlockTypes.Video:         parser = this.interpretVideoBlock;    break;
      case StoryBlockTypes.Sticker:       parser = this.interpretStickerBlock;  break;
      default:
          parser = this.interpretTextBlock;
    }

    return parser(s, phone);
  }
}