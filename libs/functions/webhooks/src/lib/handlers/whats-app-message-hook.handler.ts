import { BotProvider, WhatsAppResponse } from '@app/model/convs-mgr/functions';
import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, HttpsContext, RestResult, RestResult200 } from '@ngfi/functions';
import axios from 'axios';
import { __ConvertWhatsAppApiPayload } from '../utils/convert-whatsapp-payload.util';

export class WhatsAppMessageHookHandler extends FunctionHandler<{ val: BotProvider }, RestResult> {
  public async execute(data: {}, context: HttpsContext, tools: HandlerTools) {
    if (this._dataResIsEmpty(data)) {
      tools.Logger.log(() => `[WhatsAppMessageHookHandler] webhook is being validated first.⚠`);
      return this._verifyWhatsAppTokenWebHook(context, tools);
    } else {
      tools.Logger.log(() => `[WhatsAppMessageHookHandler]: Processing data from webhook.⌚`);
      const convertedData: WhatsAppResponse = __ConvertWhatsAppApiPayload(data);
      tools.Logger.log(() => `[WhatsAppMessageHookHandler]: Data is ${JSON.stringify(convertedData)}📅`);

      await this._addMessage(convertedData, tools)
    }
  }

  //Checks if data object is empty since it means webhook is not verified yet
  private _dataResIsEmpty(data) {
    return Object.keys(data).length === 0;
  }

  //Verifies webhook for meta
  //@See https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
  private _verifyWhatsAppTokenWebHook(context: any, tools: HandlerTools) {
    tools.Logger.log(() => `[WhatsAppMessageHookHandler] Token match successful ✅`);
    const challengeKey = 'hub.challenge';
    return context.eventContext.request.query[challengeKey] as RestResult200;
  }

  /** Calls the add message function to intepret the message and save it to firestore*/
  private async _addMessage(whatsappResponse: WhatsAppResponse, tools: HandlerTools) {
    const payload = { data: { ...whatsappResponse } };

    try {
      const resp = await axios.post('https://europe-west1-ele-convl-manager-7cd0a.cloudfunctions.net/addMessage', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      tools.Logger.log(() => `[WhatsAppMessageHookHandler] Message added successfully - ${resp}`);
      return resp;
    } catch (error) {
      tools.Logger.log(() => `[WhatsAppMessageHookHandler] Error while adding message - ${error}`);
    }
  }
}
