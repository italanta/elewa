import { HandlerTools } from "@iote/cqrs";
import { RestResult200 } from "@ngfi/functions";

/**
 * One-time procedure which happens on registration of the Whatsapp Business API webhook.
 * 
 * When a webhook is newly constructed, whatsapp sends us a validation request.
 * We reply by responding with the validation token, as outlined in this fn.
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks 
 */
export function __SendWhatsAppWebhookVerificationToken(context: any, tools: HandlerTools) 
{
  tools.Logger.log(() => `[WhatsAppReceiveIncomingMsgHandler] Token match successful ✅`);
  
  const challengeKey = 'hub.challenge';
  return context.eventContext.request.query[challengeKey] as RestResult200;
}
