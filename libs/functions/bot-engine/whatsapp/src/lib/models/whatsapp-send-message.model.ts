import axios from "axios";

import { HandlerTools } from "@iote/cqrs";
import { __DECODE_AES } from "@app/elements/base/security-config";

import { SendMessageModel } from "@app/functions/bot-engine";

import { WhatsAppMessage } from "@app/model/convs-mgr/functions";

import { WhatsAppCommunicationChannel } from "./whatsapp-comm-channel.interface";

/**
 * After the bot engine processes the incoming message and returns the next block,
 *      the block is parsed through the @see {OutgoingMessageParser}, which returns a
 *          a prepared  message that can be sent over the line to its specific channel API. 
 * 
 * @Description Model used to send the prepared messages through whatsApp api
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
 * 
 * @extends {SendMessageModel}
 * 
 * STEP 1: Assign the access token and the business phone number id
 * STEP 2: Prepare the outgoing whatsapp message
 * STEP 3: Send the message
 */
export class SendWhatsAppMessageModel extends SendMessageModel {

  constructor(private _tools: HandlerTools) {
    super()
  }

  async sendMessage(whatsappMessage: WhatsAppMessage, channel: WhatsAppCommunicationChannel){
    
    // STEP 1: Assign the access token and the business phone number id
    //            required by the whatsapp api to send messages
    const ACCESS_TOKEN = channel.accessToken
    const PHONE_NUMBER_ID = channel.businessPhoneNumberId


    // STEP 2: Prepare the outgoing whatsapp message
    //         Convert it to a JSON string
    const outgoingMessage = JSON.stringify(whatsappMessage);
   
   this._tools.Logger.log(() => `[SendWhatsAppMessageModel]._sendRequest - Generated message ${JSON.stringify(whatsappMessage)}`);

   // STEP 3: Send the message
   //         Generate the facebook url through which we send the message
   const URL = `https://graph.facebook.com/v14.0/${PHONE_NUMBER_ID}/messages`

  /**
   * Execute the post request using axios and pass in the URL, ACCESS_TOKEN and the outgoingMessage
   * 
   * @see https://axios-http.com/docs/post_example
   * 
   */
   const res = await axios.post(
     URL,
     outgoingMessage,
     {
         headers: {
           'Authorization': `Bearer ${ACCESS_TOKEN}`,
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
   return res

  }

}