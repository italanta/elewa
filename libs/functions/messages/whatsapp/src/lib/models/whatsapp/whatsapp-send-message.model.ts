import axios from "axios";
import { HandlerTools } from "@iote/cqrs";
import { WhatsAppBaseMessage } from "@app/model/convs-mgr/functions";
export class SendWhatsAppMessageModel {

  private _tools: HandlerTools;

  constructor(tools: HandlerTools, ) {
    this._tools = tools;
  }

  async sendMessage(message: WhatsAppBaseMessage, env:any) {

     const dataToSend = JSON.stringify(message);

     this._tools.Logger.log(()=> `dataToSend: ${dataToSend}`)

    //Auth token gotten from facebook api
    //TODO: @Chesa Get link between messsage and storyId to get authtoken. Use @__DECODE function to get authtoken
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