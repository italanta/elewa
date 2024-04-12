import { HandlerTools } from "@iote/cqrs";
import { RestResult, RestResult200 } from "@ngfi/functions";

/**
 * One-time procedure which happens on registration of the Whatsapp Business API webhook.
 * 
 * When a webhook is newly constructed, whatsapp sends us a validation request.
 * We reply by responding with the validation token, as outlined in this fn.
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks 
 */
export function __ValidateVerificationRequest(context: any, mode: string, token: string, tools: HandlerTools) 
{
  const challengeKey = 'hub.challenge';

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    // Respond with the challenge token from the request
    tools.Logger.log(() => `[MessengerReceiveMsgHandler] Token match successful ✅`);
    return context.eventContext.request.query[challengeKey] as RestResult200;
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    tools.Logger.log(() => `[MessengerReceiveMsgHandler] Token mismatch ❌`);

    return { status: 400, message: "Token mismatch" } as RestResult;
  }
}
