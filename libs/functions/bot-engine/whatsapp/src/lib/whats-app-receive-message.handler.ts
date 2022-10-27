import axios from "axios";
import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, HttpsContext, RestResult, RestResult200 } from "@ngfi/functions";

import { EngineBotManager } from "@app/functions/bot-engine";

import { IncomingWhatsAppMessage, WhatsAppResponse } from "@app/model/convs-mgr/functions";
import { IncomingMessage } from "@app/model/convs-mgr/conversations/messages";

import { __ConvertWhatsAppApiPayload } from "./utils/convert-whatsapp-payload.util";
import { __SendWhatsAppWebhookVerificationToken } from "./utils/validate-webhook.function";
import { ActiveChannel } from "libs/functions/bot-engine/main/src/lib/model/active-channel.service";
import { WhatsappReceiveMessageInterpreter } from "./interpreter/received-message-interpreter/whatsapp/whatsapp-api-message-to-base-message.class";

/**
 * This endpoint needs to be registered onto the whatsapp business API.
 */
export class WhatsAppReceiveIncomingMsgHandler extends FunctionHandler<IncomingWhatsAppMessage , RestResult>
{
  /**
   * Receives a message, through a channel registered on the WhatsApp Business API, 
   *    handles it, and potentially responds to it.
   * @see https://developers.facebook.com/docs/whatsapp/
   * 
   * STEP 1: Validate that this is an incoming message (could also be .e.g. WhatsApp webhook verification process)
   * STEP 2: Unpack the message and search for the correct channel
   * STEP 3: Let our bot engine process it.
   * 
   * @param {IncomingMessage} message - The message to process.
   * @returns A REST 200 or 500 response
   */
  public async execute(payload: IncomingWhatsAppMessage, context: HttpsContext, tools: HandlerTools)
  {
    // STEP 1: Validate that this is an incoming message
    // Check if we have any data. If there is no data,then the webhook needs to be validated on whatsapp business platform
    // @See https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
    if (this._dataResIsEmpty(payload)) 
      return __SendWhatsAppWebhookVerificationToken(context, tools);
    // Only proceed when we have the messages object.
    if(payload.entry[0].changes[0].value.messages)
      return { success: true } as RestResult200;

    tools.Logger.log(() =>`Rcvd Whatsapp msg ${JSON.stringify(payload.entry[0].changes)}`)

    // STEP 2: We have validated.
    //         We now unpack the message and search for the correct channel
    //         The message is converted to a generic object our engine can understand.
    const sanitizedMessage = __ConvertWhatsAppApiPayload(payload);

    // STEP 3: Create the bot engine and process the message.

    const interpreter = new WhatsappReceiveMessageInterpreter();

    const engine = new EngineBotManager(context, tools, tools.Logger, {} as ActiveChannel, interpreter);
    
    return engine.run(sanitizedMessage); 
  }

  /** 
   * Method which checks if the whatsapp data object is empty.
   *  This means the webhook has not yet been verified. */
  private _dataResIsEmpty(data) {
    return Object.keys(data).length === 0;
  }
}
