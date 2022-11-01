import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import
  {
    ActionButtonsInfo,
    InteractiveButtonMessage,
    MetaMessagingProducts,
    RecepientType,
    TextMessagePayload,
    WhatsAppImageMessage,
    WhatsAppInteractiveMessage,
    WhatsAppMessageType,
    WhatsAppTextMessage,
  } from '@app/model/convs-mgr/functions';

import { ImageMessageBlock, QuestionMessageBlock, TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { OutgoingMessageParser } from '@app/functions/bot-engine';

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
    } as WhatsAppTextMessage

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
      return {
        type: 'reply',
        reply: {
          id: option.id,
          title: option.message,
        },
      } as ActionButtonsInfo;
    });

    const interactiveMessage = {
      type: 'button',
      body: {
        text: questionBlock.message,
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

  getImageBlockParserOut(storyBlock: StoryBlock, phone: string)
  {
    const imageBlock = storyBlock as ImageMessageBlock

    // Create the image payload which will be sent to api
    const mediaMessage = {
      type: WhatsAppMessageType.IMAGE,
      image: {
        link: imageBlock.src,
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

  // getAudioBlockParserOut(storyBlock: StoryBlock, phone: string) {
  //   const audioBlock = storyBlock as AudioMessageBlock

  //   // Create the text payload which will be sent to api
  //   const mediaMessage = {
  //     type: WhatsAppMessageType.AUDIO,
  //     audio: {
  //       link: audioBlock.src,
  //     },
  //   } as WhatsAppAudioMessage;

  //   /**
  //    * Add the required fields for the whatsapp api
  //    * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
  //    */
  //   const generatedMessage: WhatsAppMessage = {
  //     messaging_product: MetaMessagingProducts.WHATSAPP,
  //     recepient_type: RecepientType.INDIVIDUAL,
  //     to: phone,
  //     type: WhatsAppMessageType.AUDIO,
  //     ...mediaMessage,
  //   };
  //   return generatedMessage;
  // }

  // getDocumentBlockParserOut(storyBlock: StoryBlock, phone: string) {
  //   const documentBlock = storyBlock as DocumentMessageBlock

  //   // Create the text payload which will be sent to api
  //   const mediaMessage = {
  //     type: WhatsAppMessageType.DOCUMENT,
  //     document: {
  //       link: documentBlock.src,
  //     },
  //   } as WhatsAppDocumentMessage;

  //   /**
  //    * Add the required fields for the whatsapp api
  //    * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
  //    */
  //   const generatedMessage: WhatsAppMessage = {
  //     messaging_product: MetaMessagingProducts.WHATSAPP,
  //     recepient_type: RecepientType.INDIVIDUAL,
  //     to: phone,
  //     type: WhatsAppMessageType.DOCUMENT,
  //     ...mediaMessage,
  //   };
  //   return generatedMessage;
  // }

  // getVideoBlockParserOut(storyBlock: StoryBlock, phone: string) {
  //   let link: string;

  //   // Create the text payload which will be sent to api
  //   const mediaMessage = {
  //     type: WhatsAppMessageType.VIDEO,
  //     video: {
  //       link,
  //     },
  //   } as WhatsAppVideoMessage;

  //   /**
  //    * Add the required fields for the whatsapp api
  //    * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
  //    */
  //   const generatedMessage: WhatsAppMessage = {
  //     messaging_product: MetaMessagingProducts.WHATSAPP,
  //     recepient_type: RecepientType.INDIVIDUAL,
  //     to: phone,
  //     type: WhatsAppMessageType.VIDEO,
  //     ...mediaMessage,
  //   };
  //   return generatedMessage;
  // }

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
