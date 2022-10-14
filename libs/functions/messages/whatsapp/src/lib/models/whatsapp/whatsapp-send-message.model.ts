import axios from "axios";
import { HandlerTools } from "@iote/cqrs";

import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { MetaMessagingProducts, RecepientType, TextMessagePayload, WhatsAppBaseMessage, WhatsAppMessageType } from "@app/model/convs-mgr/functions";

import { SendMessageModel } from "../send-message-main.model";
import { __DECODE } from "@app/elements/base/security-config";

/**
 * @Description Model used to send  messages to whatsApp api
 * @extends {SendMessageModel}
 */
export class SendWhatsAppMessageModel extends SendMessageModel {

  constructor(private _tools: HandlerTools) {
    super()
  }

  /**
   * @Description calls functions to send messages based on type of message
   * @param message
   * @param blockType
   * @param environment
   */
  async sendMessage(message: BaseMessage, endUserPhoneNumber: string, blockType: StoryBlockTypes) {
    switch (blockType) {
      case StoryBlockTypes.TextMessage:
        return await this._sendTextMessage(message, endUserPhoneNumber)    
      default:
        break;
    }
  }

  /**
   * @Description Used to send message of type text to whatsapp api
   * @param message 
   * @returns promise
   */
  protected async _sendTextMessage(message: BaseMessage, endUserPhoneNumber: string){

    // Create the text payload which will be sent to api
    const textPayload = { 
      text: {
        preview_url: false,
        body: message.message
      }
    } as TextMessagePayload

    /**
     * Add the required fields for the whatsapp api
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const generatedMessage: WhatsAppBaseMessage = {
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: endUserPhoneNumber,
      type: WhatsAppMessageType.TEXT,
      ...textPayload
    }

    // Convert the message to json
     const dataToSend = JSON.stringify(generatedMessage);

     this._tools.Logger.log(()=> `dataToSend: ${dataToSend}`)

    //Auth token gotten from facebook api
    const authorizationHeader = __DECODE(generatedMessage.authorizationKey);
   
    /**
     * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const PHONE_NUMBER_ID = generatedMessage.businessAccountId //Refers to business number to be used

    const url = `https://graph.facebook.com/v14.0/${PHONE_NUMBER_ID}/messages`
    const data = JSON.stringify(dataToSend);
    const res = await axios.post(
      url,
      data,
      {
          headers: {
            'Authorization': `Bearer ${authorizationHeader}`,
            'Content-Type': 'application/json'
          }
      }
  ).then(response => {
        this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: Successful in sending message ${JSON.stringify(response)}`);
      }).catch(error => {
        if (error.response) {
          // Request made and server responded
          this._tools.Logger.debug(()=>`[SendWhatsAppMessageModel].sendMessage: url is: ${url}`);
          this._tools.Logger.log(() => `Axios post request: Response Data error 💀 ${JSON.stringify(error.response.data)}`);
          this._tools.Logger.log(() => `Axios post request: Response Header error 🤕 ${JSON.stringify(error.response.headers)}`);
          this._tools.Logger.log(() => `Axios post request.sendMessage: Response status error⛽ ${JSON.stringify(error.response.status)}`);

        } else if (error.request) {
          // The request was made but no response was received
          this._tools.Logger.log(() => `Axios post request: Request error 🐱‍🚀${error.request}`);
        } else {
          // Something happened in setting up the request that triggered an Error
          this._tools.Logger.log(() => `Axios post request: Different Error is ${error.message}`);
        }
      })
    return await res


  }

}