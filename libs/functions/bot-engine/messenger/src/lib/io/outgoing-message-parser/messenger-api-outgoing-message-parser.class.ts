import { OutgoingMessageParser } from '@app/functions/bot-engine';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Message, MessageTemplateConfig, TemplateMessageParams } from '@app/model/convs-mgr/conversations/messages';
import { MessengerMessagingTypes, MessengerOutgoingButtonMessage, MessengerOutgoingTextMessage } from '@app/model/convs-mgr/functions';

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

    // Create the text payload which will be sent to api
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
  getImageBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    throw new Error('Method not implemented.');
  }
  getAudioBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    throw new Error('Method not implemented.');
  }
  getVideoBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    throw new Error('Method not implemented.');
  }
  getListBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    throw new Error('Method not implemented.');
  }
  getMessageTemplateParserOut(templateConfig: MessageTemplateConfig, params: TemplateMessageParams[], phone: string, message: Message)
  {
    throw new Error('Method not implemented.');
  }
  getDocumentBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    throw new Error('Method not implemented.');
  }
}
