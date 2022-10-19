import axios from "axios";
import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, HttpsContext, RestResult, RestResult200 } from "@ngfi/functions";

import { EngineChatManagerHandler } from "@app/functions/chatbot";

import { RawWhatsAppApiPayload, WhatsAppResponse } from "@app/model/convs-mgr/functions";
import { __ConvertWhatsAppApiPayload } from "../utils/convert-whatsapp-payload.util";
import { RawMessageData } from "@app/model/convs-mgr/conversations/messages";

export class WhatsAppReceiveIncomingMsgHandler extends FunctionHandler< RawWhatsAppApiPayload , RestResult>
{
  public async execute(payload:RawWhatsAppApiPayload, context: HttpsContext, tools: HandlerTools)
  {
    // Check if we have any data. If there is no data,then the webhook needs to be validated on whatsapp business platform
    // @See https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
    if (this._dataResIsEmpty(payload)) {
      tools.Logger.log(() => `[WhatsAppReceiveIncomingMsgHandler] webhook is being validated first.⚠`);
      return this._verifyWhatsAppTokenWebHook(context, tools);
    } else {
    
      // Initialize chat
      tools.Logger.log(() => `[WhatsAppReceiveIncomingMsgHandler]: Processing data from webhook.⌚`);
      const convertedData: WhatsAppResponse = __ConvertWhatsAppApiPayload(payload);
      tools.Logger.log(() => `[WhatsAppReceiveIncomingMsgHandler]: Data is ${JSON.stringify(convertedData)}📅`);


      await this._processMessage(convertedData, context, tools)
    }
  }

  //Checks if data object is empty since it means webhook is not verified yet
  private _dataResIsEmpty(data) {
    return Object.keys(data).length === 0;
  }

  //Verifies webhook for meta
  //@See https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
  private _verifyWhatsAppTokenWebHook(context: any, tools: HandlerTools) {
    tools.Logger.log(() => `[WhatsAppReceiveIncomingMsgHandler] Token match successful ✅`);
    const challengeKey = 'hub.challenge';
    return context.eventContext.request.query[challengeKey] as RestResult200;
  }

  /** Calls the add message function to intepret the message and save it to firestore*/
  private async _processMessage(req: WhatsAppResponse, context: any, tools: HandlerTools){
    const data = req as RawMessageData
    return await new EngineChatManagerHandler().execute(data, context, tools)
  }
}
