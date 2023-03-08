import { Message, MessageTemplateConfig, OutgoingMessagePayload } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Our chatbot can send different types of messages, be it a text message, a location, an image, ...
 * 
 * The channel API (responsible for sending and receiving messages) requires each of these messages to be sent in a certain format/via a certain contract.
 * 
 * Here we define methods that 
 * 
 * @param {storyBlock}     - The StoryBlock to send. StoryBlocks are prepared messages in a format our chatbot can understand.
 * @param {phone}          - Phonenumber to which to send the message
 *
 */
export abstract class OutgoingMessageParser
{

  abstract getTextBlockParserOut     (storyBlock: StoryBlock, phone: string): any

  abstract getQuestionBlockParserOut (storyBlock: StoryBlock, phone: string): any

  abstract getImageBlockParserOut    (storyBlock: StoryBlock, phone: string): any

  abstract getAudioBlockParserOut    (storyBlock: StoryBlock, phone: string): any

  abstract getVideoBlockParserOut    (storyBlock: StoryBlock, phone: string): any

  abstract getListBlockParserOut     (storyBlock: StoryBlock, phone: string): any

  abstract getMessageTemplateParserOut (templateConfig: MessageTemplateConfig, phone: string): any

  // abstract getStickerBlockParserOut  (storyBlock: StoryBlock, phone: string): Message

  abstract getDocumentBlockParserOut (storyBlock: StoryBlock, phone: string): any

  // abstract getLocationBlockParserOut (storyBlock: StoryBlock, phone: string): Message

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
  parse(storyBlock: StoryBlock, phone: string) : OutgoingMessagePayload
  {
    let parser!: (storyBlock: StoryBlock, phone: string) => OutgoingMessagePayload;
    
    switch (storyBlock.type) {
      case StoryBlockTypes.TextMessage:   parser = this.getTextBlockParserOut;     break;
      case StoryBlockTypes.Name:          parser = this.getTextBlockParserOut;     break;
      case StoryBlockTypes.Email:         parser = this.getTextBlockParserOut;     break;
      case StoryBlockTypes.PhoneNumber:   parser = this.getTextBlockParserOut;     break;   
      case StoryBlockTypes.QuestionBlock: parser = this.getQuestionBlockParserOut; break;
      case StoryBlockTypes.List:          parser = this.getListBlockParserOut;     break;
      case StoryBlockTypes.Image:         parser = this.getImageBlockParserOut;    break;
      case StoryBlockTypes.Video:         parser = this.getVideoBlockParserOut;    break;
      case StoryBlockTypes.Document:      parser = this.getDocumentBlockParserOut; break;
      case StoryBlockTypes.Audio:         parser = this.getAudioBlockParserOut;    break;
      // case StoryBlockTypes.Sticker:       parser = this.getStickerBlockParserOut;  break;
      default:
          parser = this.getTextBlockParserOut;
    }

    return parser(storyBlock, phone);
  }

  parseOutMessageTemplate(templateConfig: MessageTemplateConfig, phone: string) {
    return this.getMessageTemplateParserOut(templateConfig, phone);
  }
}