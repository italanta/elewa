import axios from "axios";

import { HandlerTools } from "@iote/cqrs";
import { __DECODE } from "@app/elements/base/security-config";

import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { WhatsAppBaseMessage } from "@app/model/convs-mgr/functions";
import { WhatsappChannel } from "@app/model/bot/channel";

import { SendMessageModel } from "../send-message-main.model";



/**
 * @Description Model used to send  messages to whatsApp api
 * Converts the blocks to whatsapp api readable form
 * 
 * Sample payloads:
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
 * 
 * @extends {SendMessageModel}
 * TODO: Move the conversion of messages to a seperate class that handles all messages
 */
export class SendWhatsAppMessageModel extends SendMessageModel {

  constructor(private _tools: HandlerTools) {
    super()
  }

  async sendMessage(message: BaseMessage, channel: WhatsappChannel){

    const whatsappMessage = message as WhatsAppBaseMessage

    // Convert the message to json
    const dataToSend = JSON.stringify(whatsappMessage);

   //Auth token gotten from facebook api
   const authorizationHeader = channel.authorizationKey
  
   this._tools.Logger.log(() => `[SendWhatsAppMessageModel]._sendRequest - Generated message ${JSON.stringify(whatsappMessage)}`);
   
   /**
    * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
    */
   const PHONE_NUMBER_ID = channel.businessPhoneNumberId//Refers to business number to be used

   const url = `https://graph.facebook.com/v14.0/${PHONE_NUMBER_ID}/messages`

   const res = await axios.post(
     url,
     dataToSend,
     {
         headers: {
           'Authorization': `Bearer ${authorizationHeader}`,
           'Content-Type': 'application/json'
         }
     }
 ).then(response => {
       this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: Success in sending message ${JSON.stringify(response.data)}`);
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