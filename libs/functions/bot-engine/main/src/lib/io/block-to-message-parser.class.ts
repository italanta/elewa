import { AudioMessage, ImageMessage, Message, QuestionMessage, QuestionMessageOptions, TextMessage, VideoMessage } from '@app/model/convs-mgr/conversations/messages';
import { MessageTypes } from '@app/model/convs-mgr/functions';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageMessageBlock, ListMessageBlock, QuestionMessageBlock, TextMessageBlock, VideoMessageBlock, VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

export class BlockToStandardMessage
{
  convert(block: StoryBlock)
  {
    let converter!: (block: StoryBlock) => Message;

    switch (block.type) {
      case StoryBlockTypes.TextMessage:              converter = this.convertTextMessageBlock;     break;
      case StoryBlockTypes.Name:                     converter = this.convertTextMessageBlock;     break;
      case StoryBlockTypes.Email:                    converter = this.convertTextMessageBlock;     break;
      case StoryBlockTypes.PhoneNumber:              converter = this.convertTextMessageBlock;     break;   
      case StoryBlockTypes.QuestionBlock:            converter = this.convertQuestionMessageBlock; break;
      case StoryBlockTypes.Image:                    converter = this.convertImageMessageBlock;    break;
      case StoryBlockTypes.ListBlock     :           converter = this.convertTextMessageBlock;     break;
      case StoryBlockTypes.LocationInputBlock:       converter = this.convertTextMessageBlock;     break;
      case StoryBlockTypes.Video:                    converter = this.convertVideoMessageBlock;     break;
      case StoryBlockTypes.Audio:                    converter = this.convertAudioMessageBlock;     break;

      default:
        converter = this.convertTextMessageBlock;
    }

    return converter(block)
  }

  protected convertTextMessageBlock(block: TextMessageBlock): TextMessage
  {
    // Create the base message object
    const newMessage: TextMessage = {

      type: MessageTypes.TEXT,
      text: block.message,
      payload: block,
    };

    return newMessage;
  }


  protected convertQuestionMessageBlock(block: QuestionMessageBlock): QuestionMessage
  {
    const options: QuestionMessageOptions[] = block.options.map((option) =>
    ({
        optionId: option.id,
        optionText: option.message,
        optionValue: option.value
    }));

    const baseMessage: QuestionMessage = {
      type: MessageTypes.QUESTION,
      questionText: block.message,
      options
    };

    return baseMessage;
  }

  protected convertListMessageBlock(block: ListMessageBlock): QuestionMessage
  {
    const options: QuestionMessageOptions[] = block.options.map((option) =>
    ({
        optionId: option.id,
        optionText: option.message,
        optionValue: option.value
    }));

    const baseMessage: QuestionMessage = {
      type: MessageTypes.QUESTION,
      questionText: block.message,
      options
    };

    return baseMessage;
  }

  protected convertImageMessageBlock(block: ImageMessageBlock): ImageMessage
  {
    const standardMessage: ImageMessage = {
      mediaId: block.id,
      type: MessageTypes.IMAGE,
      url: block.fileSrc,
      payload: block,
    };

    return standardMessage;
  }

  protected convertVideoMessageBlock(block: VideoMessageBlock): VideoMessage
  {
    const standardMessage: VideoMessage = {
      mediaId: block.id,
      type: MessageTypes.VIDEO,
      url: block.fileSrc,
      payload: block,
    };

    return standardMessage;
  }

  protected convertAudioMessageBlock(block: VoiceMessageBlock): AudioMessage
  {
    const standardMessage: AudioMessage = {
      mediaId: block.id,
      type: MessageTypes.AUDIO,
      url: block.fileSrc,
      payload: block,
    };

    return standardMessage;
  }
}
