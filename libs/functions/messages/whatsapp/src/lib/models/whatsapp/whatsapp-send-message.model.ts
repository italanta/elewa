import axios from "axios";
import { HandlerTools } from "@iote/cqrs";
import { MetaMessagingProducts, RecepientType, WhatsAppBaseMessage, WhatsAppMessageType } from "@app/model/convs-mgr/functions";
import { SendMessageModel } from "../send-message-main.model";
import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
export class SendWhatsAppMessageModel extends SendMessageModel {

  constructor(private _tools: HandlerTools) {
    super()
  }

  async sendMessage(message: BaseMessage, env:any) {

    const generatedMessage: WhatsAppBaseMessage = {
      ...message,
      messaging_product: MetaMessagingProducts.WHATSAPP,
      recepient_type: RecepientType.INDIVIDUAL,
      to: message.phoneNumber,
      type: WhatsAppMessageType.TEXT

    }

     const dataToSend = JSON.stringify(generatedMessage);

     this._tools.Logger.log(()=> `dataToSend: ${dataToSend}`)

    //Auth token gotten from facebook api
    const authorizationHeader = env.AUTHORIZATION_HEADER;
   
    /**
     * https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const PHONE_NUMBER_ID = 103844892462329 //Refers to business number to be used
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