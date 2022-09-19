import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { HandlerTools } from "@iote/cqrs";
import axios from "axios";


export class SendWhatsAppMessageModel {

  private _tools: HandlerTools;

  constructor(tools: HandlerTools) {
    this._tools = tools;
  }

  async sendMessage(message?: StoryBlock) {

    const authorizationHeader = process.env.AUTHORIZATION_HEADER;
    this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: 🔑🔐authorizationHeader: ${authorizationHeader}`);

    this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: ✉✉Message is =====>${JSON.stringify(message)}`);

    const PHONE_NUMBER = 103844892462329 //Refers to business number to be used
    const url = `https://graph.facebook.com/v14.0/${PHONE_NUMBER}/messages`
    const data = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": "254706165412",
      "type": "text",
      "text": {
        "preview_url": false,
        "body": "test"
      }
    }

    const res = await axios.post(
      url,
      data,
      {
          headers: {
            'Authorization': `Bearer ${authorizationHeader}` ,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
  ).then(response => {
        this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: Response is ${response}`);
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