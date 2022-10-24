import { StoryBlock } from '@app/model/bot/blocks/story-block';
import { BaseChannel, WhatsappChannel } from '@app/model/bot/channel';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { ActionButtonsInfo, InteractiveButtonMessage, MetaMessagingProducts, RecepientType, TextMessagePayload, WhatsAppBaseMessage, WhatsAppInteractiveMessage, WhatsAppMediaMessage, WhatsAppMessageType } from '@app/model/convs-mgr/functions';
import { QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { SendMessageInterpreter } from '../send-message-interpreter-abstract.class';


/**
 * Interprets messages received from whatsapp and converts them to a BaseMessage
 * @see WhatsAppMessageType - for the types of messages received from whatsapp
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */
export class WhatsappSendMessageInterpreter extends SendMessageInterpreter {

  /**
   * @Description Used to send message of type text to whatsapp api
   * @param message 
   * @returns promise
   */
  interpretTextBlock(message: BaseMessage, block: StoryBlock, channel: BaseChannel): WhatsAppBaseMessage {
    let body: string;

    if(block){
      body = block.message
    } else {
      body = message.message
    }
    // Create the text payload which will be sent to api
    const textPayload = { 
      text: {
        preview_url: false,
        body
      }
    } as TextMessagePayload

    const generatedMessage: WhatsAppBaseMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: message.phoneNumber,
      type: WhatsAppMessageType.TEXT,
      ...textPayload
    }

    return generatedMessage
  }

  
  /**
   * We transform the Question block to a button interactive message for whatsapp api
   * @Description Used to send Question Block to whatsapp api
   */
   interpretQuestionBlock(message: BaseMessage, block: StoryBlock, channel: BaseChannel){
    const qBlock = block as QuestionMessageBlock

    const buttons = qBlock.options.map((option)=>{
      return {
        type: "reply",
        reply: {
          id: option.id,
          title: option.message
        }
      } as ActionButtonsInfo
    })

    const interactiveMessage = {
      type: 'button',
      body: {
        text: qBlock.message
      },
      action: {
        buttons
      }
    } as InteractiveButtonMessage

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppInteractiveMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: message.phoneNumber,
      type: WhatsAppMessageType.INTERACTIVE,
      interactive: {
        ...interactiveMessage
      }
    } 

   return generatedMessage

  }

  interpretMediaBlock (message: BaseMessage, block: StoryBlock, channel: BaseChannel){
    let link: string;

    if(block){
      link = block.message
    } else {
      link = message.message
    }
    // Create the text payload which will be sent to api
    const mediaMessage = { 
      type: WhatsAppMessageType.MEDIA,
      image: {
        link
      }
    } as WhatsAppMediaMessage

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppBaseMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: message.phoneNumber,
      type: WhatsAppMessageType.MEDIA,
      ...mediaMessage
    }
    return generatedMessage
  }
}
