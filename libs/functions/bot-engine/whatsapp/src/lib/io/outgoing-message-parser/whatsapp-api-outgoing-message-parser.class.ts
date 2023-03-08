import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import
{
  ActionButtonsInfo,
  ActionInfo,
  ActionSectionInfo,
  ActionSectionInfoRow,
  InteractiveButtonMessage,
  InteractiveListMessage,
  MetaMessagingProducts,
  RecepientType,
  WhatsAppAudioMessage,
  WhatsAppDocumentMessage,
  WhatsAppImageMessage,
  WhatsAppInteractiveMessage,
  WhatsAppMessageType,
  WhatsAppTemplateMessage,
  WhatsappTemplateParameter,
  WhatsAppTextMessage,
  WhatsAppVideoMessage,
} from '@app/model/convs-mgr/functions';

import { DocumentMessageBlock, ImageMessageBlock, ListMessageBlock, QuestionMessageBlock, TextMessageBlock, VideoMessageBlock, VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { OutgoingMessageParser } from '@app/functions/bot-engine';
import { MessageTemplateConfig } from '@app/model/convs-mgr/conversations/messages';

/**
 * Interprets messages received from whatsapp and converts them to a Message
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */
export class WhatsappOutgoingMessageParser extends OutgoingMessageParser
{
  /**
   * @Description Used to send message of type text to whatsapp api
   * @param message
   * @returns promise
   */
  getTextBlockParserOut(textBlock: TextMessageBlock, phone: string): any
  {

    // Create the text payload which will be sent to api
    const textPayload = {
      type: WhatsAppMessageType.TEXT,
      text: {
        preview_url: false,
        body: textBlock.message as string,
      },
    } as WhatsAppTextMessage;

    const generatedMessage: WhatsAppTextMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      ...textPayload
    };

    return generatedMessage;
  }

  /**
   * We transform the Question block to a button interactive message for whatsapp api
   * @Description Used to send Question Block to whatsapp api
   */
  getQuestionBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    const questionBlock = storyBlock as QuestionMessageBlock;

    const buttons = questionBlock.options.map((option) =>
    {
      // Truncate option.message to 24 characters
      if (option.message.length > 20) {
        option.message = option.message.substring(0, 20);
      }

      return {
        type: 'reply',
        reply: {
          id: option.id,
          title: option.message || "",
        },
      } as ActionButtonsInfo;
    });

    const interactiveMessage = {
      type: 'button',
      body: {
        text: questionBlock.message || "",
      },
      action: {
        buttons,
      },
    } as InteractiveButtonMessage;

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppInteractiveMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      type: WhatsAppMessageType.INTERACTIVE,
      interactive: {
        ...interactiveMessage,
      },
    };

    return generatedMessage;
  }

  /**
    * We transform the Question block to a button interactive message for whatsapp api
    * @Description Used to send Question Block to whatsapp api
    */
  getListBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    const listBlock = storyBlock as QuestionMessageBlock;

    const rows = listBlock.options.map((option) => 
    {
      // Truncate option.message to 24 characters
      if (option.message.length > 24) {
        option.message = option.message.substring(0, 24);
      }


      return {
        id: option.id,
        title: option.message || "",
        description: option.value
      } as ActionSectionInfoRow;
    });

    const interactiveMessage = {
      type: 'list',
      body: {
        text: listBlock.message || ""
      },
      action: {
        button: "Options",
        sections: [{
          title: "Please select",
          rows
        }]
      } as ActionInfo,
    } as InteractiveListMessage;

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppInteractiveMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      type: WhatsAppMessageType.INTERACTIVE,
      interactive: {
        ...interactiveMessage,
      },
    };

    return generatedMessage;
  }

  getImageBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    const imageBlock = storyBlock as ImageMessageBlock;

    // Create the image payload which will be sent to api
    const mediaMessage = {
      type: WhatsAppMessageType.IMAGE,
      image: {
        caption: imageBlock.message || "",
        link: imageBlock.fileSrc,
      },
    } as WhatsAppImageMessage;

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppImageMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      type: WhatsAppMessageType.IMAGE,
      ...mediaMessage,
    };
    return generatedMessage;
  }

  getAudioBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    const audioBlock = storyBlock as VoiceMessageBlock;

    // Create the text payload which will be sent to api
    const mediaMessage = {
      type: WhatsAppMessageType.AUDIO,
      audio: {
        link: audioBlock.fileSrc,
      },
    } as WhatsAppAudioMessage;

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppAudioMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      type: WhatsAppMessageType.AUDIO,
      ...mediaMessage,
    };
    return generatedMessage;
  }

  getVideoBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    const videoBlock = storyBlock as VideoMessageBlock;

    // Create the text payload which will be sent to api
    const mediaMessage = {
      type: WhatsAppMessageType.VIDEO,
      video: {
        caption: videoBlock.message || "",
        link: videoBlock.fileSrc,
      },
    } as WhatsAppVideoMessage;

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppVideoMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      type: WhatsAppMessageType.VIDEO,
      ...mediaMessage,
    };
    return generatedMessage;
  }

  getDocumentBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    const documentBlock = storyBlock as DocumentMessageBlock;
    
    // Create the text payload which will be sent to api
    const documentMessage = {
      type: WhatsAppMessageType.DOCUMENT,
      document: {
        filename: documentBlock.message || "untitled",
        link: documentBlock.fileSrc,
      },
    } as WhatsAppDocumentMessage;

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppDocumentMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      type: WhatsAppMessageType.DOCUMENT,
      ...documentMessage,
    };
    return generatedMessage;
  }


  getMessageTemplateParserOut(templateConfig: MessageTemplateConfig, phone: string)
  {
    const { name, languageCode, params } = templateConfig;

    const templateParams: WhatsappTemplateParameter[] = params.map((param) =>
    {
      return {
        type: WhatsAppMessageType.TEXT,
        text: param,
      };
    });

    // Create the message template payload which will be sent to whatsapp
    const messageTemplate: WhatsAppTemplateMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: phone,
      type: WhatsAppMessageType.TEMPLATE,
      template: {
        name,
        language: {
          code: languageCode,
        },
        components: [
          {
            type: "body",
            parameters: templateParams,
          }
        ]
      }
    };

    return messageTemplate;
  }
  // getStickerBlockParserOut(storyBlock: StoryBlock, phone: string) {
  //   // TODO: 
  //   let link: string;

  //   // Create the text payload which will be sent to api
  //   const mediaMessage = {
  //     type: WhatsAppMessageType.STICKER,
  //     sticker: {
  //       link,
  //     },
  //   } as WhatsAppStickerMessage;

  //   /**
  //    * Add the required fields for the whatsapp api
  //    * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
  //    */
  //   const generatedMessage: WhatsAppMessage = {
  //     messaging_product: MetaMessagingProducts.WHATSAPP,
  //     recepient_type: RecepientType.INDIVIDUAL,
  //     to: phone,
  //     type: WhatsAppMessageType.STICKER,
  //     ...mediaMessage,
  //   };
  //   return generatedMessage;
  // }

  // getLocationBlockParserOut(storyBlock: StoryBlock, phone: string): Message {
  //   const locationBlock = storyBlock as LocationMessageBlock
  //   // Create the text payload which will be sent to api
  //   const locationMessage = {
  //     location: {
  //       longitude: parseInt(locationBlock.locationInput.longitude),
  //       latitude: parseInt(locationBlock.locationInput.latitude),
  //       name: locationBlock.locationInput.name,
  //       address: locationBlock.locationInput.address
  //     }
  //   } as WhatsAppLocationMessage

  //   /**
  //    * Add the required fields for the whatsapp api
  //    * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
  //    */
  //   const generatedMessage: WhatsAppMessage = {
  //     messaging_product: MetaMessagingProducts.WHATSAPP,
  //     recepient_type: RecepientType.INDIVIDUAL,
  //     to: phone,
  //     type: WhatsAppMessageType.LOCATION,
  //     ...locationMessage,
  //   };
  //   return generatedMessage;
  // }
}
