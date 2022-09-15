import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { HandlerTools } from "@iote/cqrs";
import axios from "axios";


export class SendWhatsAppMessageModel {

  private _tools:HandlerTools;

  constructor(tools: HandlerTools) { 
    this._tools = tools;
  }

  async sendMessage(message?: StoryBlock) {
    const authorizationHeader = process.env.AUTHORIZATION_HEADER;

    this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: ${JSON.stringify(message)}`);

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

    const res = await axios.post(`${url}`, data, {
      headers: {
        'Authorization': `${authorizationHeader}`,
        'content-type': 'text/json'
      }
    });

    return Promise.resolve(res.data.headers['Content-Type']); 

  }




}