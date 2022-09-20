import axios from "axios";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { HandlerTools } from "@iote/cqrs";
import { GetWhatsAppMessageTypeService } from "../../services/get-whatsapp-message-type.service";
export class SendWhatsAppMessageModel {

  private _tools: HandlerTools;

  constructor(tools: HandlerTools, ) {
    this._tools = tools;
  }

  async sendMessage(message: StoryBlock, env:any) {

    //Service to get data to send to to whatsapp api
    const getMessageTypeService = new GetWhatsAppMessageTypeService(this._tools);

    const dataToSend = getMessageTypeService.getDataToSend(message);

    //Auth token gotten from facebook api
    const authorizationHeader = env.AUTHORIZATION_HEADER;
   
    /**
     * https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
     */
    const PHONE_NUMBER_ID = 103844892462329 //Refers to business number to be used
    const url = `https://graph.facebook.com/v14.0/${PHONE_NUMBER_ID}/messages`
    const data = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": "254706165412", 
      "type": "text",
      "text": {
        "preview_url": false,
        "body": `${dataToSend}`
      }
    }

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