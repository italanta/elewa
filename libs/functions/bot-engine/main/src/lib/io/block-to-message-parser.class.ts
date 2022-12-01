import { ImageMessage, Message, QuestionMessage, QuestionMessageOptions, TextMessage } from '@app/model/convs-mgr/conversations/messages';
import { MessageTypes } from '@app/model/convs-mgr/functions';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageMessageBlock, QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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
    {
      return {
        optionId: option.id,
        optionText: option.message,
        optionValue: option.value
      };
    });

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
      imageId: block.id,
      type: MessageTypes.IMAGE,
      url: block.fileSrc,
      payload: block,
    };

    return standardMessage;
  }

  // protected convertListMessageBlock(block: ListMes): QuestionMessage
  // {
  //   const interactiveMessage = message as InteractiveListReplyMessage;

  //   const baseMessage: QuestionMessage = {
  //     type: MessageTypes.QUESTION,
  //     endUserPhoneNumber: message.from,
  //     optionId: interactiveMessage.interactive.list_reply.id,
  //     optionText: interactiveMessage.interactive.list_reply.title,
  //     payload: message,
  //   };

  //   return baseMessage;
  // }

  /**
   * Converts an location whatsapp message to a standadized location Message @see {LocationMessageBlock}
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#location-messages
   */
  // protected convertLocationMessageBlock(block: LocationMessageBlock): LocationMessage
  // {
  //   const standardMessage: LocationMessage = {
  //     type: MessageTypes.LOCATION,
  //     endUserPhoneNumber: incomingMessage.from,
  //     location: incomingMessage.location,
  //     payload: incomingMessage,
  //   };

  //   return standardMessage;
  // }


  /**
   * Converts an audio whatsapp message to a standadized audio Message
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#media-messages
   */
  // protected convertAudioMessageBlock(block: AudioMessa): AudioMessage
  // {
  //   const standardMessage: AudioMessage = {
  //     id: incomingMessage.id,
  //     type: MessageTypes.AUDIO,
  //     endUserPhoneNumber: incomingMessage.from,
  //     audioId: incomingMessage.audio.id,
  //     payload: incomingMessage,
  //     mime_type: incomingMessage.audio.mime_type
  //   };

  //   return standardMessage;
  // }

  /**
   * Converts an audio whatsapp message to a standadized audio Message
   *
   * When a user sends their location, whatsapp sends us their location in terms of longitude and latitude
   *
   * Payload example:
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#media-messages
   */
  // protected convertVideoMessageBlock(incomingMessage: VideoPayload): VideoMessage
  // {
  //   const standardMessage: VideoMessage = {
  //     id: incomingMessage.id,
  //     type: MessageTypes.AUDIO,
  //     endUserPhoneNumber: incomingMessage.from,
  //     videoId: incomingMessage.video.id,
  //     payload: incomingMessage,
  //     mime_type: incomingMessage.video.mime_type
  //   };

  //   return standardMessage;
  // }
}
