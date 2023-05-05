import { OutgoingMessageParser } from '@app/functions/bot-engine';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { FileMessageBlock, ListMessageBlock, QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Message, MessageTemplateConfig, TemplateMessageParams } from '@app/model/convs-mgr/conversations/messages';
import { MessengerAttachmentType, MessengerMessagingTypes, MessengerOutgoingAttachmentMessage, MessengerOutgoingButtonMessage, MessengerOutgoingListMessage, MessengerOutgoingListMessageElement, MessengerOutgoingTextMessage, MessengerTemplateType } from '@app/model/convs-mgr/functions';

/**
 * Interprets messages received from whatsapp and converts them to a Message
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */
export class MessengerOutgoingMessageParser extends OutgoingMessageParser
{

  constructor() { super(); }

  /**
   * @Description Used to send message of type text to whatsapp api
   * @param message
   * @returns promise
   */
  getTextBlockParserOut(textBlock: TextMessageBlock, recepientId: string): any
  {
    // Create the text payload which will be sent to api
    const generatedMessage: MessengerOutgoingTextMessage = {
      recipient: {
        id: recepientId,
      },
      messaging_type: MessengerMessagingTypes.RESPONSE,
      message: {
        text: textBlock.message || "",
      }
    };

    return generatedMessage;
  }

  getQuestionBlockParserOut(questionBlock: QuestionMessageBlock, recepientId: string)
  {

    const questionButtons = questionBlock.options.map(button =>
    {
      return {
        type: "postback",
        title: button.message,
        payload: button.id
      };
    });

    // Create the button payload which will be sent to api
    const generatedMessage: MessengerOutgoingButtonMessage = {
      recipient: {
        id: recepientId,
      },
      messaging_type: MessengerMessagingTypes.RESPONSE,
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: questionBlock.message || "",
            buttons: questionButtons
          }
        }
      }
    };

    return generatedMessage;
  }
  getImageBlockParserOut(textBlock: TextMessageBlock, recepientId: string)
  {
    // Create the image payload which will be sent to api
    return __getMediaBlockParserOut(textBlock, recepientId, MessengerAttachmentType.IMAGE);
  }
  getAudioBlockParserOut(textBlock: TextMessageBlock, recepientId: string)
  {
    // Create the audio payload which will be sent to api
    return __getMediaBlockParserOut(textBlock, recepientId, MessengerAttachmentType.AUDIO);
  }
  getVideoBlockParserOut(textBlock: TextMessageBlock, recepientId: string)
  {
    // Create the video payload which will be sent to api
    return __getMediaBlockParserOut(textBlock, recepientId, MessengerAttachmentType.VIDEO);
  }

  getDocumentBlockParserOut(textBlock: TextMessageBlock, recepientId: string)
  {
    // Create the file payload which will be sent to api
    return __getMediaBlockParserOut(textBlock, recepientId, MessengerAttachmentType.FILE);
  }

  getListBlockParserOut(listBlock: ListMessageBlock, recepientId: string)
  {
    const listItems = listBlock.options.map(button =>
      {
        return {
          title: button.message,
          buttons: [
            {
              type: "postback",
              title: button.message,
              payload: button.id
            }
          ]
        } as MessengerOutgoingListMessageElement;
      });
  
      // Create the button payload which will be sent to api
      const generatedMessage: MessengerOutgoingListMessage = {
        recipient: {
          id: recepientId,
        },
        messaging_type: MessengerMessagingTypes.RESPONSE,
        message: {
          attachment: {
            type: MessengerAttachmentType.TEMPLATE,
            payload: {
              template_type:  MessengerTemplateType.GENERIC,
              elements: listItems
            }
          }
        }
      };
  
      return generatedMessage;
  }
  
  getMessageTemplateParserOut(templateConfig: MessageTemplateConfig, params: TemplateMessageParams[], phone: string, message: Message)
  {
    throw new Error('Method not implemented.');
  }
}

function __getMediaBlockParserOut(mediaBlock: FileMessageBlock, recepientId: string, type: MessengerAttachmentType)
{

  const generatedMessage: MessengerOutgoingAttachmentMessage = {
    recipient: {
      id: recepientId,
    },
    messaging_type: MessengerMessagingTypes.RESPONSE,
    message: {
      attachment: {
        type: type,
        payload: {
          url: mediaBlock.fileSrc,
          is_reusable: true
        }
      }
    }
  };
  return generatedMessage;
}
