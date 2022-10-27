import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Our chatbot can send different types of messages, be it a text message, a location, an image, ...
 * 
 * The channel API (responsible for sending and receiving messages) requires each of these messages to be sent in a certain format/via a certain contract.
 * 
 * Here we define methods that 
 * 
 * @param {block} - This is passed to determine the fields 
 *
 */
export abstract class OutgoingMessageParser
{

  abstract getTextBlockParserOut     (storyBlock: StoryBlock, phone: string): Message

  abstract getQuestionBlockParserOut (storyBlock: StoryBlock, phone: string): Message

  abstract getImageBlockParserOut    (storyBlock: StoryBlock, phone: string): Message

  abstract getAudioBlockParserOut    (storyBlock: StoryBlock, phone: string): Message

  abstract getVideoBlockParserOut    (storyBlock: StoryBlock, phone: string): Message

  abstract getStickerBlockParserOut  (storyBlock: StoryBlock, phone: string): Message

  abstract getDocumentBlockParserOut (storyBlock: StoryBlock, phone: string): Message

  abstract getLocationBlockParserOut (storyBlock: StoryBlock, phone: string): Message

  /**
   * Our chatbot can send different types of messages, be it a text message, a location, an image, ...
   * 
   * The channel API (responsible for sending and receiving messages) requires each of these messages to be sent in a certain format/via a certain contract.
   * 
   * @param {StoryBlock}     - The StoryBlock to send. StoryBlocks are prepared messages in a format our chatbot can understand.
   * @param {string}         - Phonenumber to which to send the message
   * 
   * @returns {Message}
   * A prepared  message which can be sent over the line to its specific channel API.
   */
  parse(block: StoryBlock, phone: string) : Message
  {
    let parser!: (storyBlock: StoryBlock, phone: string) => Message;
    
    switch (block.type) {
      case StoryBlockTypes.TextMessage:   parser = this.getTextBlockParserOut;     break;
      case StoryBlockTypes.Name:          parser = this.getTextBlockParserOut;     break;
      case StoryBlockTypes.Email:         parser = this.getTextBlockParserOut;     break;
      case StoryBlockTypes.PhoneNumber:   parser = this.getTextBlockParserOut;     break;   
      case StoryBlockTypes.QuestionBlock: parser = this.getQuestionBlockParserOut; break;
      case StoryBlockTypes.Image:         parser = this.getImageBlockParserOut;    break;
      case StoryBlockTypes.Document:      parser = this.getDocumentBlockParserOut; break;
      case StoryBlockTypes.Audio:         parser = this.getAudioBlockParserOut;    break;
      case StoryBlockTypes.Video:         parser = this.getVideoBlockParserOut;    break;
      case StoryBlockTypes.Sticker:       parser = this.getStickerBlockParserOut;  break;
      default:
          parser = this.getTextBlockParserOut;
    }

    return parser(block, phone);
  }
}